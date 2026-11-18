import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "@/lib/r2";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const { contentType, size } = await req.json();

    const ext = EXT[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 422 },
      );
    }
    if (typeof size !== "number" || size <= 0 || size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 422 },
      );
    }

    const key = `uploads/${crypto.randomUUID()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        ContentType: contentType,
        ContentLength: size,
      }),
      { expiresIn: 60 },
    );

    return NextResponse.json({ uploadUrl, key });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
