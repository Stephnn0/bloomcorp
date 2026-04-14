import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { createCompany, updateCompany, deleteCompany } from "../../../models/company";

export default async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
      state: (formData.get("state") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      teamId: user.teamId,
    };
    try {
      const company = await createCompany(data, db);
      return { success: true, company };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "toggle") {
    const id = formData.get("id") as string;
    const isActive = formData.get("isActive") === "true";
    try {
      await updateCompany(id, user.teamId, { isActive }, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    try {
      await deleteCompany(id, user.teamId, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  return { errors: "Invalid intent" };
}
