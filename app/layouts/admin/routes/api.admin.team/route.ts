import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { UserRole } from "generated/prisma/client";

export async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);

  if (user.role !== UserRole.ADMIN) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const roleStr = formData.get("role") as string;
    const firebaseUid = formData.get("firebaseUid") as string;

    if (!name || !email || !roleStr || !firebaseUid) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const role = roleStr === "ADMIN" ? UserRole.ADMIN : UserRole.MANAGER;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    try {
      await db.user.create({ data: { name, email, role, teamId: user.teamId, firebaseUid } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (intent === "updateRole") {
    const id = formData.get("id") as string;
    const roleStr = formData.get("role") as string;
    const role = roleStr === "ADMIN" ? UserRole.ADMIN : UserRole.MANAGER;

    if (id === user.id) {
      return Response.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    try {
      // Only update if same team
      await db.user.updateMany({ where: { id, teamId: user.teamId }, data: { role } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (intent === "toggle") {
    const id = formData.get("id") as string;
    const isActive = formData.get("isActive") === "true";

    if (id === user.id) {
      return Response.json({ error: "Cannot deactivate yourself" }, { status: 400 });
    }

    try {
      await db.user.updateMany({ where: { id, teamId: user.teamId }, data: { isActive } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;

    if (id === user.id) {
      return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    try {
      await db.user.deleteMany({ where: { id, teamId: user.teamId } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Invalid intent" }, { status: 400 });
}
