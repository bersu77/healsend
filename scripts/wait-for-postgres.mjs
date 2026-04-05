import net from "node:net";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const parsedUrl = new URL(databaseUrl);
const host = parsedUrl.hostname;
const port = Number(parsedUrl.port || 5432);
const timeoutMs = Number(process.env.DB_WAIT_TIMEOUT_MS || 60000);
const startedAt = Date.now();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryConnect = () =>
  new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });

    socket.setTimeout(2000);

    socket.once("connect", () => {
      socket.end();
      resolve();
    });

    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });

    socket.once("error", (error) => {
      socket.destroy();
      reject(error);
    });
  });

while (Date.now() - startedAt < timeoutMs) {
  try {
    await tryConnect();
    console.log(`Postgres is ready at ${host}:${port}.`);
    process.exit(0);
  } catch {
    process.stdout.write(".");
    await delay(1000);
  }
}

console.error(`\nTimed out waiting for Postgres at ${host}:${port}.`);
process.exit(1);
