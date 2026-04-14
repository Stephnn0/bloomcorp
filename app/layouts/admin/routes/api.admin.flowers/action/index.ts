import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { createFlower, updateFlower, deleteFlower, getFlowerById } from "../../../models/flower";
import { deleteFromS3, getKeyFromUrl } from "~/s3.server";

export default async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      price: parseFloat(formData.get("price") as string),
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      category: (formData.get("category") as string) || undefined,
      occasion: (formData.get("occasion") as string) || undefined,
      teamId: user.teamId,
    };
    try {
      const flower = await createFlower(data, db);
      return { success: true, flower };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "toggle") {
    const id = formData.get("id") as string;
    const isActive = formData.get("isActive") === "true";
    try {
      await updateFlower(id, user.teamId, { isActive }, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    try {
      // Try to clean up S3 image before deleting
      const flower = await getFlowerById(id, user.teamId, db);
      if (flower?.imageUrl) {
        const key = getKeyFromUrl(flower.imageUrl);
        if (key) {
          try { await deleteFromS3(key); } catch {}
        }
      }
      await deleteFlower(id, user.teamId, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  return { errors: "Invalid intent" };
}
