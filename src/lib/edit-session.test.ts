import { expect, test } from "bun:test";
import { createEditSession, isValidEditSession } from "./edit-session";

process.env.DIARY_EDIT_SECRET = "test-secret";

test("accepts a signed future editor session", () => {
  const token = createEditSession(Date.now() + 60_000);

  expect(isValidEditSession(token)).toBe(true);
});

test("rejects a changed or expired editor session", () => {
  const token = createEditSession(Date.now() + 60_000);

  expect(isValidEditSession(`${token}x`)).toBe(false);
  expect(isValidEditSession(createEditSession(Date.now() - 1))).toBe(false);
});
