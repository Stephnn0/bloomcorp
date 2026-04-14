import { getCurrentUser } from "~/auth.server";
import { uploadToS3 } from "~/s3.server";
import crypto from "node:crypto";

export async function action({ request }: { request: Request }) {
  await getCurrentUser(request);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return Response.json(
      { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
      { status: 400 }
    );
  }

  // Limit to 5MB
  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { error: "File too large. Maximum 5MB allowed." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `arrangements/${crypto.randomUUID()}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToS3(buffer, key, file.type);
    return Response.json({ url });
  } catch (error: any) {
    console.error("S3 upload error:", error);
    return Response.json(
      { error: "Failed to upload image. Check your S3 configuration." },
      { status: 500 }
    );
  }
}
