import { describe, expect, test } from "bun:test";
import { memoryInputSchema, uploadPayloadSchema } from "./diary";

describe("memoryInputSchema", () => {
  test("accepts a complete memory", () => {
    expect(
      memoryInputSchema.safeParse({
        title: "Lần đầu gặp",
        note: "Trời mưa.",
        occurredAt: "2026-10-16",
      }).success,
    ).toBe(true);
  });

  test("rejects blank or overlong text and invalid dates", () => {
    expect(memoryInputSchema.safeParse({ title: "", note: "", occurredAt: "2026-10-16" }).success).toBe(false);
    expect(memoryInputSchema.safeParse({ title: "x".repeat(121), note: "", occurredAt: "2026-10-16" }).success).toBe(false);
    expect(memoryInputSchema.safeParse({ title: "Ngày mưa", note: "x".repeat(5001), occurredAt: "2026-10-16" }).success).toBe(false);
    expect(memoryInputSchema.safeParse({ title: "Ngày mưa", note: "", occurredAt: "not-a-date" }).success).toBe(false);
  });
});

test("upload payload only accepts a valid memory id", () => {
  expect(uploadPayloadSchema.safeParse('{"memoryId":"c123456789012345678901234"}').success).toBe(true);
  expect(uploadPayloadSchema.safeParse("{}").success).toBe(false);
});
