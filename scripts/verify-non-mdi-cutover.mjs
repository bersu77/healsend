import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const NEXT_BIN =
  process.platform === "win32"
    ? path.join(process.cwd(), "node_modules", ".bin", "next.cmd")
    : path.join(process.cwd(), "node_modules", ".bin", "next");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseLastJson(stdout) {
  const text = String(stdout || "").trim();

  for (let index = text.lastIndexOf("{"); index >= 0; index = text.lastIndexOf("{", index - 1)) {
    const candidate = text.slice(index);
    try {
      return JSON.parse(candidate);
    } catch {
      // continue searching
    }
  }

  return null;
}

function buildMarkdownReport({ generatedAt, baseUrl, steps, overallStatus }) {
  const failures = steps.filter((step) => !step.ok);
  const lines = [
    "# Non-MDI Cutover Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${baseUrl}\``,
    `- Steps: \`${steps.length}\``,
    `- Passing: \`${steps.length - failures.length}\``,
    `- Failing: \`${failures.length}\``,
    `- Overall status: \`${overallStatus}\``,
    "",
  ];

  if (failures.length === 0) {
    lines.push(
      "The repo-controlled non-MDI cutover checks are green. What remains before a public switch is target-environment validation for Stripe, GHL, uploads, webhooks, and rollback readiness.",
    );
  } else {
    lines.push("## Failures", "");
    for (const failure of failures) {
      lines.push(`- \`${failure.name}\` — ${failure.summary}`);
    }
  }

  lines.push("", "## Step Results", "");

  for (const step of steps) {
    const details = [];
    if (step.durationMs) {
      details.push(`${step.durationMs}ms`);
    }
    if (step.reportPath) {
      details.push(`report: \`${step.reportPath}\``);
    }
    if (step.extraSummary) {
      details.push(step.extraSummary);
    }

    lines.push(
      `- \`${step.name}\` — ${step.ok ? "PASS" : "FAIL"} — ${step.summary}${details.length > 0 ? ` (${details.join(" • ")})` : ""}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }
        resolve(port);
      });
    });
  });
}

async function runCommand({
  name,
  command,
  args,
  env = {},
  expectJson = false,
}) {
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("close", (code) => {
      const durationMs = Date.now() - startedAt;
      const parsedJson = expectJson ? parseLastJson(stdout) : null;

      resolve({
        name,
        ok: code === 0,
        code,
        durationMs,
        stdout,
        stderr,
        json: parsedJson,
      });
    });
  });
}

async function waitForServer(baseUrl, timeoutMs = 20000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        redirect: "manual",
        headers: { accept: "text/html" },
      });

      if (response.status === 200) {
        return;
      }
    } catch {
      // keep polling
    }

    await wait(400);
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function stopServer(serverProcess) {
  if (!serverProcess || serverProcess.killed) {
    return;
  }

  serverProcess.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => serverProcess.once("close", resolve)),
    wait(4000),
  ]);

  if (!serverProcess.killed) {
    serverProcess.kill("SIGKILL");
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const steps = [];
  let serverProcess = null;
  let baseUrl = "";

  try {
    steps.push(
      await runCommand({
        name: "lint",
        command: "npm",
        args: ["run", "lint"],
      }),
    );

    if (!steps.at(-1)?.ok) {
      throw new Error("Lint failed");
    }

    steps.push(
      await runCommand({
        name: "build",
        command: "npm",
        args: ["run", "build"],
      }),
    );

    if (!steps.at(-1)?.ok) {
      throw new Error("Build failed");
    }

    const catalogAudit = await runCommand({
      name: "catalog audit",
      command: "node",
      args: ["--env-file=.env", "scripts/audit-public-catalog.mjs"],
      expectJson: true,
    });
    steps.push(catalogAudit);
    if (!catalogAudit.ok) {
      throw new Error("Catalog audit failed");
    }

    const port = await findFreePort();
    baseUrl = `http://127.0.0.1:${port}`;
    serverProcess = spawn(NEXT_BIN, ["start", "-p", String(port)], {
      cwd: process.cwd(),
      env: { ...process.env, PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    await waitForServer(baseUrl);

    const runtimeSteps = [
      {
        name: "catalog runtime verification",
        env: { CATALOG_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/verify-public-catalog-runtime.mjs"],
      },
      {
        name: "shortcode audit",
        env: {},
        args: ["--env-file=.env", "scripts/audit-shortcode-pages.mjs"],
      },
      {
        name: "shortcode runtime verification",
        env: { SHORTCODE_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/verify-shortcode-runtime.mjs"],
      },
      {
        name: "public SEO audit",
        env: { SEO_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/audit-public-seo.mjs"],
      },
      {
        name: "public media audit",
        env: { MEDIA_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/audit-public-media.mjs"],
      },
      {
        name: "upload runtime verification",
        env: { UPLOAD_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/verify-upload-runtime.mjs"],
      },
      {
        name: "non-MDI runtime verification",
        env: { NON_MDI_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/verify-non-mdi-runtime.mjs"],
      },
      {
        name: "commerce runtime verification",
        env: { COMMERCE_AUDIT_BASE_URL: baseUrl },
        args: ["--env-file=.env", "scripts/verify-commerce-runtime.mjs"],
      },
    ];

    for (const step of runtimeSteps) {
      const result = await runCommand({
        name: step.name,
        command: "node",
        args: step.args,
        env: step.env,
        expectJson: true,
      });
      steps.push(result);

      if (!result.ok) {
        throw new Error(`${step.name} failed`);
      }
    }
  } catch (error) {
    steps.push({
      name: "summary",
      ok: false,
      code: 1,
      durationMs: 0,
      stdout: "",
      stderr: String(error?.message || error || "Unknown error"),
      json: null,
    });
  } finally {
    await stopServer(serverProcess);
  }

  const normalizedSteps = steps.map((step) => {
    const json = step.json || null;
    const reportPath =
      json?.latestPath ||
      json?.markdownPath ||
      json?.jsonPath ||
      "";

    return {
      name: step.name,
      ok: step.ok,
      durationMs: step.durationMs,
      reportPath: reportPath
        ? path.relative(process.cwd(), reportPath)
        : "",
      summary:
        step.name === "summary"
          ? step.stderr
          : step.ok
            ? `exit ${step.code}`
            : `exit ${step.code}`,
      extraSummary: json
        ? [
            typeof json.totalRoutes === "number"
              ? `${json.totalRoutes} routes`
              : "",
            typeof json.totalChecks === "number"
              ? `${json.totalChecks} checks`
              : "",
            typeof json.failedCount === "number"
              ? `${json.failedCount} failed`
              : "",
            typeof json.failureCount === "number"
              ? `${json.failureCount} failures`
              : "",
            json.summary?.readyPublicProducts
              ? `${json.summary.readyPublicProducts} ready products`
              : "",
            typeof json.weakDescriptions === "number"
              ? `${json.weakDescriptions} weak descriptions`
              : "",
            typeof json.suspiciousRouteCount === "number"
              ? `${json.suspiciousRouteCount} suspicious media routes`
              : "",
          ]
            .filter(Boolean)
            .join(" • ")
        : "",
    };
  });

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const overallStatus = normalizedSteps.every((step) => step.ok)
    ? "PASS"
    : "FAIL";
  const report = buildMarkdownReport({
    generatedAt,
    baseUrl: baseUrl || "not-started",
    steps: normalizedSteps,
    overallStatus,
  });

  const payload = {
    generatedAt,
    baseUrl: baseUrl || "not-started",
    overallStatus,
    steps: normalizedSteps,
  };

  const jsonPath = path.join(OUTPUT_DIR, `non-mdi-cutover-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `non-mdi-cutover-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "non-mdi-cutover-latest.md");

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: baseUrl || "not-started",
        overallStatus,
        totalSteps: normalizedSteps.length,
        failedSteps: normalizedSteps.filter((step) => !step.ok).length,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (overallStatus !== "PASS") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
