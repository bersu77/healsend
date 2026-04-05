import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const CONTENT_TYPES = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveFilename(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.includes("/") || raw.includes("\\")) {
    return "";
  }
  return raw;
}

export async function GET(_request, context) {
  const params = await context?.params;
  const filename = resolveFilename(params?.filename);
  if (!filename) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(UPLOAD_DIR, filename));
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
