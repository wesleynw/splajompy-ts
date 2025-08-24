import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), "public", ".well_known", ...path);
    
    const fileContent = await readFile(filePath, "utf-8");
    
    // Set appropriate content type based on file extension
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    });
    
    return new NextResponse(fileContent, { headers });
  } catch (error) {
    console.error("Error serving .well-known file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}