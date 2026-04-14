import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { getFlowers } from "../../../models/flower";

export default async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const flowers = await getFlowers(db, user.teamId);
  return { flowers };
}
