import fs from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "docs", "audits");
const BASE_URL = String(
  process.env.UPLOAD_AUDIT_BASE_URL ||
    process.env.BASE_URL ||
    "http://127.0.0.1:3000",
).replace(/\/+$/, "");

function buildMarkdownReport({ generatedAt, result }) {
  const lines = [
    "# Upload Runtime Verification",
    "",
    `- Generated at: \`${generatedAt}\``,
    `- Base URL: \`${BASE_URL}\``,
    `- Status: \`${result.ok ? "PASS" : "FAIL"}\``,
    "",
  ];

  if (result.ok) {
    lines.push(
      "The upload route accepted a test image, returned a stored public URL, served the uploaded asset, and cleaned up the temporary file afterward.",
    );
  } else {
    lines.push(`- Failure: ${result.failure}`);
  }

  lines.push("", "## Details", "");
  lines.push(`- API status: \`${result.apiStatus}\``);
  lines.push(`- Asset status: \`${result.assetStatus}\``);
  lines.push(`- Uploaded URL: \`${result.url || "n/a"}\``);
  lines.push(`- Cleanup: \`${result.cleanedUp ? "done" : "not-run"}\``);

  return `${lines.join("\n")}\n`;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const formData = new FormData();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" rx="8" fill="#5b3cdd"/></svg>`;
  formData.set(
    "file",
    new Blob([svg], { type: "image/svg+xml" }),
    "cutover-upload-check.svg",
  );

  const result = {
    ok: false,
    failure: "",
    apiStatus: 0,
    assetStatus: 0,
    url: "",
    filename: "",
    cleanedUp: false,
  };

  try {
    const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    result.apiStatus = uploadResponse.status;

    const payload = await uploadResponse.json().catch(() => null);
    result.url = payload?.url || "";
    result.filename = payload?.filename || "";

    if (!uploadResponse.ok || !result.url || !result.filename) {
      result.failure = `expected successful upload response, got ${uploadResponse.status}`;
    } else {
      const assetResponse = await fetch(new URL(result.url, `${BASE_URL}/`));
      result.assetStatus = assetResponse.status;

      if (assetResponse.status !== 200) {
        result.failure = `expected uploaded asset to be reachable, got ${assetResponse.status}`;
      } else {
        result.ok = true;
      }
    }
  } catch (error) {
    result.failure = error?.message || "Upload verification failed";
  } finally {
    if (result.filename) {
      try {
        await fs.unlink(path.join(process.cwd(), "public", "uploads", result.filename));
        result.cleanedUp = true;
      } catch {
        result.cleanedUp = false;
      }
    }
  }

  const generatedAt = new Date().toISOString();
  const timestamp = generatedAt.replace(/[:.]/g, "-");
  const report = buildMarkdownReport({ generatedAt, result });
  const payload = { generatedAt, baseUrl: BASE_URL, result };
  const jsonPath = path.join(OUTPUT_DIR, `upload-runtime-${timestamp}.json`);
  const markdownPath = path.join(OUTPUT_DIR, `upload-runtime-${timestamp}.md`);
  const latestPath = path.join(OUTPUT_DIR, "upload-runtime-latest.md");

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.writeFile(markdownPath, report);
  await fs.writeFile(latestPath, report);

  console.log(
    JSON.stringify(
      {
        generatedAt,
        baseUrl: BASE_URL,
        ok: result.ok,
        apiStatus: result.apiStatus,
        assetStatus: result.assetStatus,
        jsonPath,
        markdownPath,
        latestPath,
      },
      null,
      2,
    ),
  );

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
