import { createSessionCookie, decodeFirebaseToken } from "~/auth.server";
import db from "~/db.server";
import { UserRole } from "generated/prisma/client";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const idToken = formData.get("idToken") as string;
  const teamName = formData.get("companyName") as string; // "companyName" from the form = team name
  const name = formData.get("name") as string;

  if (!idToken || !teamName || !name) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const decoded = decodeFirebaseToken(idToken);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const { uid, email } = decoded;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { firebaseUid: uid },
    });
    if (existingUser) {
      const cookie = createSessionCookie(idToken);
      return Response.json(
        { success: true },
        { headers: { "Set-Cookie": cookie } }
      );
    }

    // Create Team + Admin user in a single transaction
    await db.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name: teamName },
      });

      await tx.user.create({
        data: {
          firebaseUid: uid,
          email,
          name,
          role: UserRole.ADMIN,
          teamId: team.id,
        },
      });
    });

    const cookie = createSessionCookie(idToken);
    return Response.json(
      { success: true },
      { headers: { "Set-Cookie": cookie } }
    );
  } catch (error: any) {
    return Response.json(
      { error: "Registration failed: " + error.message },
      { status: 500 }
    );
  }
}
