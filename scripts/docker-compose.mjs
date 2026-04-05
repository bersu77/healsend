import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

const run = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, { stdio: "inherit" });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      return { status: null, notFound: true };
    }

    console.error(result.error);
    process.exit(1);
  }

  return { status: result.status ?? 1, notFound: false };
};

const hasDockerComposePlugin = () => {
  const result = spawnSync("docker", ["compose", "version"], { stdio: "ignore" });
  return result.status === 0;
};

if (hasDockerComposePlugin()) {
  const result = run("docker", ["compose", ...args]);
  process.exit(result.status ?? 1);
}

const fallback = run("docker-compose", args);

if (fallback.notFound) {
  console.error(
    "Docker Compose is not available. Install Docker Desktop (Compose v2) or the legacy docker-compose binary.",
  );
  process.exit(1);
}

process.exit(fallback.status ?? 1);
