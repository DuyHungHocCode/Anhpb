import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const EDIT_SESSION_COOKIE = "diary-editor";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function signature(expiresAt: number) {
  const secret = process.env.DIARY_EDIT_SECRET;
  if (!secret) throw new Error("DIARY_EDIT_SECRET chưa được cấu hình");
  return createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
}

export function createEditSession(expiresAt = Date.now() + SESSION_DURATION_MS) {
  return `${expiresAt}.${signature(expiresAt)}`;
}

export function isValidEditSession(value: string | undefined, now = Date.now()) {
  if (!value) return false;
  const [expiresAtValue, providedSignature, ...rest] = value.split(".");
  const expiresAt = Number(expiresAtValue);
  if (rest.length || !Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  try {
    const expectedSignature = signature(expiresAt);
    const provided = Buffer.from(providedSignature ?? "");
    const expected = Buffer.from(expectedSignature);
    return provided.length === expected.length && timingSafeEqual(provided, expected);
  } catch {
    return false;
  }
}

export async function requireEditorSession() {
  const token = (await cookies()).get(EDIT_SESSION_COOKIE)?.value;
  if (!isValidEditSession(token)) throw new Error("UNAUTHORIZED_EDITOR");
}

export function editorSessionMaxAge() {
  return SESSION_DURATION_MS / 1000;
}

export function secretsMatch(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}
