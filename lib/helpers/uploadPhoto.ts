export async function uploadPhoto(file: File): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType: file.type,
    }),
  });

  const { url, fields, key } = await res.json();

  const formData = new FormData();

  Object.entries(fields).forEach(([k, v]) => {
    formData.append(k, v as string);
  });

  formData.append("file", file);

  const uploadRes = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("S3 upload failed");
  }

  return key; // ✅ THIS is what you store in DB
}
