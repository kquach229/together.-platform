// 1. Ask our API for a presigned POST URL — keeps AWS keys server-side
// 2. POST the file directly from the browser to S3
// 3. Return the S3 object key to store on the signature row
export async function uploadPhoto(
  file: File,
  cardId?: string,
): Promise<string> {
  // Step 1 — get presigned URL from our server
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, cardId }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to get upload URL");
  }

  const { url, fields, key } = await res.json();

  // Step 2 — upload directly to S3 using the presigned POST
  // The fields from S3 must come first, file must be last
  const formData = new FormData();
  Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string));
  formData.append("file", file);

  const s3Res = await fetch(url, { method: "POST", body: formData });
  if (!s3Res.ok) throw new Error("Failed to upload photo");

  // Step 3 — return the key so it can be stored on the signature
  return key;
}
