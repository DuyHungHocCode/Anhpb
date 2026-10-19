import { describe, expect, mock, test } from "bun:test";

const findMany = mock(async () => []);
const create = mock(async () => ({}));
const findUnique = mock(async () => null);
const remove = mock(async () => ({}));
const del = mock(async () => undefined);

mock.module("./db", () => ({ db: { memory: { findMany, create, findUnique, delete: remove } } }));
mock.module("@vercel/blob", () => ({ del }));

const { createMemory, deleteMemory, listMemories } = await import("./memories");

describe("memory service", () => {
  test("lists memories chronologically", async () => {
    await listMemories();
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }] }));
  });

  test("does not create a memory with invalid input", async () => {
    await expect(createMemory({ title: "", note: "", occurredAt: "2026-10-16" })).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });

  test("does not remove database data when Blob deletion fails", async () => {
    findUnique.mockResolvedValueOnce({ id: "c123456789012345678901234", images: [{ pathname: "memories/a.jpg" }] });
    del.mockRejectedValueOnce(new Error("Blob unavailable"));
    await expect(deleteMemory("c123456789012345678901234")).rejects.toThrow("Blob unavailable");
    expect(remove).not.toHaveBeenCalled();
  });
});
