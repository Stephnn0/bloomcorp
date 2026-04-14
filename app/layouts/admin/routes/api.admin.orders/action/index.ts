import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { createOrder, updateOrderStatus } from "../../../models/order";

export default async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const arrangementId = formData.get("arrangementId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;

    const arrangement = await db.flowerArrangement.findFirst({
      where: { id: arrangementId, teamId: user.teamId },
    });
    if (!arrangement) {
      return { errors: "Arrangement not found" };
    }

    const data = {
      companyId: formData.get("companyId") as string,
      employeeId: formData.get("employeeId") as string,
      occasion: (formData.get("occasion") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      deliveryDate: formData.get("deliveryDate") as string,
      deliveryAddress: (formData.get("deliveryAddress") as string) || undefined,
      teamId: user.teamId,
      items: [{ arrangementId, quantity, price: arrangement.price }],
    };
    try {
      const order = await createOrder(data, db);
      return { success: true, order };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "updateStatus") {
    const id = formData.get("id") as string;
    const status = formData.get("status") as any;
    try {
      await updateOrderStatus(id, user.teamId, status, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  return { errors: "Invalid intent" };
}
