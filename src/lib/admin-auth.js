import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET (or NEXTAUTH_SECRET) must be set to use the admin area"
    );
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

/** Constant-time compare that does not leak the secret's length. */
function safeEqual(a, b) {
  const ah = createHmac("sha256", "cmp").update(String(a), "utf8").digest();
  const bh = createHmac("sha256", "cmp").update(String(b), "utf8").digest();
  return timingSafeEqual(ah, bh);
}

/**
 * Check a username and password against the server-only env vars.
 * Deliberately no fallback: if the vars are unset, nobody gets in.
 */
export function checkCredentials(username, password) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return false;
  // Evaluate both so timing does not reveal which one failed.
  const userOk = safeEqual(username || "", user);
  const passOk = safeEqual(password || "", pass);
  return userOk && passOk;
}

export function createSessionToken() {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${expiresAt}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return false;

  const split = token.lastIndexOf(".");
  if (split < 1) return false;

  const payload = token.slice(0, split);
  const signature = token.slice(split + 1);

  let provided;
  let expected;
  try {
    provided = Buffer.from(signature, "hex");
    expected = Buffer.from(sign(payload), "hex");
  } catch {
    return false;
  }
  if (provided.length === 0 || provided.length !== expected.length) return false;
  if (!timingSafeEqual(provided, expected)) return false;

  const expiresAt = Number(payload.split(".")[0]);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

/** True when the caller presents a valid admin session cookie. */
export async function isAdminRequest() {
  try {
    const store = await cookies();
    return verifySessionToken(store.get(SESSION_COOKIE)?.value);
  } catch {
    return false;
  }
}
