import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { getEmployees } from "../../../models/employee";

export default async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId") ?? undefined;
  const employees = await getEmployees(db, user.teamId, companyId);
  return { employees };
}
