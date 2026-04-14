import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { getOrders } from "../../../models/order";

export default async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId") ?? undefined;
  const orders = await getOrders(db, user.teamId, companyId);
  return { orders };
}
