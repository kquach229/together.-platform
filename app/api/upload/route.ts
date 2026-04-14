// app/api/upload/route.ts
// Generates a presigned S3 POST URL for direct browser-to-S3 uploads.
// cardId is optional — when omitted, a temp/ prefix is used.
// AWS credentials never leave the server.

import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomBytes } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const { contentType, cardId } = await req.json();

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 422 },
      );
    }

    const ext = contentType.split("/")[1];
    const uid = randomBytes(16).toString("hex");

    // If cardId is provided, file is scoped to that card.
    // If not (e.g. during card creation), use a temp/ prefix.
    // temp/ objects can be cleaned up by an S3 lifecycle rule after 24h.
    const key = cardId
      ? `signatures/${cardId}/${uid}.${ext}`
      : `cover-photos/${uid}.${ext}`;

    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ["content-length-range", 0, MAX_SIZE_BYTES],
        ["eq", "$Content-Type", contentType],
      ],
      Fields: { "Content-Type": contentType },
      Expires: 60,
    });

    return NextResponse.json({ url, fields, key });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
