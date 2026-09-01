import { NextResponse } from "next/server";
import { uploadImageToR2 } from "@/lib/r2";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB max

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const siteId = (formData.get("siteId") as string) || "default";

    if (!file) {
      return NextResponse.json({ error: "No file provided in request." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Supported formats: WEBP, PNG, JPG, SVG, AVIF, GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 6MB limit. Please upload an optimized image." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageToR2(buffer, file.name, file.type, siteId);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      fileName: file.name,
      size: result.size,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error("Image upload to R2 failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image to storage. Please verify R2 credentials." },
      { status: 500 }
    );
  }
}
