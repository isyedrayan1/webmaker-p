import { NextResponse } from "next/server";
import { getImageFromR2 } from "@/lib/r2";
import { Readable } from "node:stream";

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string[] }> | { key: string[] } }
) {
  try {
    const resolvedParams = await (context.params instanceof Promise
      ? context.params
      : Promise.resolve(context.params));

    const keyArray = resolvedParams?.key;
    if (!keyArray || keyArray.length === 0) {
      return new NextResponse("Asset key required", { status: 400 });
    }

    const key = keyArray.join("/");
    const asset = await getImageFromR2(key);

    if (!asset || !asset.body) {
      return new NextResponse("Asset not found in storage", { status: 404 });
    }

    // Convert AWS SDK stream to Web ReadableStream
    let webStream: ReadableStream;
    if (asset.body instanceof ReadableStream) {
      webStream = asset.body;
    } else if (asset.body instanceof Readable) {
      webStream = Readable.toWeb(asset.body) as ReadableStream;
    } else if (typeof (asset.body as { transformToByteArray?: () => Promise<Uint8Array> }).transformToByteArray === "function") {
      const bytes = await (asset.body as { transformToByteArray: () => Promise<Uint8Array> }).transformToByteArray();
      return new NextResponse(bytes as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": asset.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
          ...(asset.eTag ? { ETag: asset.eTag } : {}),
        },
      });
    } else {
      const buffer = await (asset.body as unknown as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": asset.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
        },
      });
    }

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
        ...(asset.eTag ? { ETag: asset.eTag } : {}),
      },
    });
  } catch (error) {
    console.error("Failed to stream asset from R2:", error);
    return new NextResponse("Asset streaming failed", { status: 404 });
  }
}
