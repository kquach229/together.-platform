import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomBytes } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

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

    // Generate a unique key for th S3 object
    const ext = contentType.split("/")[1];
    const key = `SIGNATURES/${cardId}/${randomBytes(16).toString("hex")}.${ext}`;

    // Generate presigned POST - expires in 60 seconds
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

    console.log(url, fields);

    return NextResponse.json({ url, fields, key });
  } catch (err) {
    console.error("POST /api/upload", err);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
