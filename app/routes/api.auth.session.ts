import { redirect } from "react-router";
import {
  createSessionCookie,
  destroySessionCookie,
  decodeFirebaseToken,
} from "~/auth.server";
import db from "~/db.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "login") {
    const idToken = formData.get("idToken") as string;
    if (!idToken) {
      return Response.json({ error: "Missing token" }, { status: 400 });
    }

    try {
      const decoded = decodeFirebaseToken(idToken);
      if (!decoded) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
      }

      const { uid, email } = decoded;

      // Look up by firebaseUid first
      let user = await db.user.findUnique({ where: { firebaseUid: uid } });

      if (!user) {
        // Check if admin pre-added this email (team invite)
        user = await db.user.findUnique({ where: { email } });

        if (user && !user.firebaseUid) {
          // Link Firebase UID to the pre-created record
          user = await db.user.update({
            where: { id: user.id },
            data: { firebaseUid: uid },
          });
        }
      }

      if (!user) {
        return Response.json(
          {
            error:
              "No account found. Please register first or ask your admin to add you.",
          },
          { status: 403 }
        );
      }

      if (!user.isActive) {
        return Response.json(
          { error: "Your account has been deactivated. Contact your admin." },
          { status: 403 }
        );
      }

      const cookie = createSessionCookie(idToken);
      return Response.json(
        { success: true },
        { headers: { "Set-Cookie": cookie } }
      );
    } catch (error: any) {
      return Response.json(
        { error: "Failed to create session: " + error.message },
        { status: 401 }
      );
    }
  }

  if (intent === "logout") {
    const cookie = destroySessionCookie();
    return redirect("/login", {
      headers: { "Set-Cookie": cookie },
    });
  }

  return Response.json({ error: "Invalid intent" }, { status: 400 });
}
