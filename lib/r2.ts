import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client configured for Cloudflare R2
const accountId = process.env.R2_ACCOUNT_ID || "70cc063896aa84d90f0f722b23fd3d02";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
export const bucketName = process.env.R2_BUCKET_NAME || "webmaker";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export interface UploadImageResult {
  key: string;
  url: string;
  mimeType: string;
  size: number;
}

/**
 * Upload a binary image buffer or Uint8Array to Cloudflare R2
 */
export async function uploadImageToR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  mimeType: string,
  siteId = "general"
): Promise<UploadImageResult> {
  const ext = fileName.split(".").pop()?.toLowerCase() || "webp";
  const cleanBase = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .slice(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const key = `uploads/${siteId}/${cleanBase}-${randomSuffix}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      Metadata: {
        siteId,
        uploadedAt: new Date().toISOString(),
      },
    })
  );

  // In Webmaker, images are served securely through the Next.js API proxy or directly
  const url = `/api/assets/${key}`;

  return {
    key,
    url,
    mimeType,
    size: fileBuffer.length,
  };
}

/**
 * Fetch an image object from R2 as a ReadableStream or Buffer
 */
export async function getImageFromR2(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await r2Client.send(command);
  return {
    body: response.Body,
    contentType: response.ContentType || "image/webp",
    contentLength: response.ContentLength,
    eTag: response.ETag,
  };
}

/**
 * Delete an image object from R2
 */
export async function deleteImageFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return await r2Client.send(command);
}
