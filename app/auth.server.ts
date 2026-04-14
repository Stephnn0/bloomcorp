import crypto from "node:crypto";
import { parse, serialize } from "cookie";
import { redirect } from "react-router";
import db from "~/db.server";

const SESSION_COOKIE_NAME = "__session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 days
const SECRET =
  process.env.SESSION_SECRET || "dev-secret-please-change-in-production";

// ── Helpers: HMAC-signed cookie values ──

function sign(value: string): string {
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.substring(0, idx);
  const expected = sign(value);
  if (
    signed.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signed), Buffer.from(expected))
  ) {
    return value;
  }
  return null;
}

// ── Decode a Firebase ID token (JWT) ──

export function decodeFirebaseToken(idToken: string) {
  const parts = idToken.split(".");
  if (parts.length !== 3) return null;
  const payload = JSON.parse(
    Buffer.from(parts[1], "base64url").toString("utf-8")
  );
  if (!payload.sub || !payload.email) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return { uid: payload.sub as string, email: payload.email as string };
}

// ── Session cookie helpers ──

export function createSessionCookie(idToken: string): string {
  const user = decodeFirebaseToken(idToken);
  if (!user) throw new Error("Invalid or expired Firebase token");

  const value = JSON.stringify({ uid: user.uid, email: user.email });
  return serialize(SESSION_COOKIE_NAME, sign(value), {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export function getSessionUser(
  request: Request
): { uid: string; email: string } | null {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookies = parse(cookieHeader);
  const raw = cookies[SESSION_COOKIE_NAME];
  if (!raw) return null;
  const value = unsign(raw);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function requireAuth(request: Request) {
  const user = getSessionUser(request);
  if (!user) throw redirect("/login");
  return user;
}

export function destroySessionCookie() {
  return serialize(SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// ── DB user helper ──

/**
 * Load the full DB user (with teamId, role, team name) from the session.
 * Throws redirect to /login if unauthenticated or user not found.
 */
export async function getCurrentUser(request: Request) {
  const session = requireAuth(request);

  const user = await db.user.findUnique({
    where: { email: session.email },
    include: { team: { select: { id: true, name: true } } },
  });

  if (!user || !user.isActive) throw redirect("/login");

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    teamId: user.teamId,
    teamName: user.team.name,
  };
}
