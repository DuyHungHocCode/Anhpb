import { expect, test } from "bun:test";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/diary";
import { uploadConstraints } from "./route";

test("constrains direct uploads to supported image types and size", () => {
  expect(uploadConstraints("memories/c123456789012345678901234/photo.jpg", "{\"memoryId\":\"c123456789012345678901234\"}")).toEqual({
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
    addRandomSuffix: true,
    tokenPayload: "{\"memoryId\":\"c123456789012345678901234\"}",
  });
});

test("rejects a pathname outside the memory", () => {
  expect(() => uploadConstraints("memories/other/photo.jpg", "{\"memoryId\":\"c123456789012345678901234\"}")).toThrow();
});
