import { NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

const DATA_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "curator-data.json",
);
const TMP_FILE_PATH = path.join(os.tmpdir(), "good-company-curator-data.json");

export async function GET() {
  try {
    let bundledData: any = null;
    let tmpData: any = null;

    if (fs.existsSync(DATA_FILE_PATH)) {
      bundledData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf-8"));
    }
    if (fs.existsSync(TMP_FILE_PATH)) {
      tmpData = JSON.parse(fs.readFileSync(TMP_FILE_PATH, "utf-8"));
    }

    const chosen =
      tmpData &&
      (!bundledData?.updatedAt ||
        new Date(tmpData.updatedAt).getTime() >=
          new Date(bundledData.updatedAt).getTime())
        ? tmpData
        : bundledData;

    if (chosen) {
      return NextResponse.json(chosen, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  } catch (err) {
    console.error("Error reading curator data file:", err);
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { books, currentBookId, updatedAt } = body;

    if (!books || !Array.isArray(books)) {
      return NextResponse.json(
        { error: "Invalid books array" },
        { status: 400 },
      );
    }

    const payload = {
      currentBookId: currentBookId || books[0]?.id,
      books,
      updatedAt: updatedAt || new Date().toISOString(),
    };

    const pathsToUpdate = [TMP_FILE_PATH, DATA_FILE_PATH];
    const workspacePath =
      "/Users/useruser/Downloads/good-company/src/data/curator-data.json";
    if (
      workspacePath !== DATA_FILE_PATH &&
      fs.existsSync(path.dirname(workspacePath))
    ) {
      pathsToUpdate.push(workspacePath);
    }

    for (const targetPath of pathsToUpdate) {
      try {
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2), "utf-8");
      } catch {
        // Ignore read-only filesystem errors on serverless hosts (TMP_FILE_PATH still succeeds)
      }
    }

    return NextResponse.json({
      success: true,
      count: books.length,
      updatedAt: payload.updatedAt,
    });
  } catch (err) {
    console.error("Error writing curator data file:", err);
    return NextResponse.json(
      { error: "Failed to write curator data" },
      { status: 500 },
    );
  }
}
