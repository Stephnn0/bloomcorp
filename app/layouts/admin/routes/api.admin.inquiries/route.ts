import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";

export async function loader({ request }: { request: Request }) {
  await getCurrentUser(request);

  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = await db.inquiry.count({
    where: { isRead: false },
  });

  return { inquiries, unreadCount };
}

export async function action({ request }: { request: Request }) {
  await getCurrentUser(request);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "markRead") {
    const id = formData.get("id") as string;
    try {
      await db.inquiry.update({ where: { id }, data: { isRead: true } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (intent === "markAllRead") {
    try {
      await db.inquiry.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    try {
      await db.inquiry.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Invalid intent" }, { status: 400 });
}
