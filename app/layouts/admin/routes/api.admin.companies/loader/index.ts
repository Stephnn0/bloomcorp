import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { getCompanies } from "../../../models/company";

export default async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const companies = await getCompanies(db, user.teamId);
  return { companies };
}
