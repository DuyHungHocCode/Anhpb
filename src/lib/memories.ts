import { del } from "@vercel/blob";
import { db } from "./db";
import { memoryInputSchema, toDiaryMemory, type MemoryInput } from "./diary";

const includeImages = { images: { orderBy: { createdAt: "asc" } } } as const;

export async function listMemories() {
  const memories = await db.memory.findMany({
    include: includeImages,
    orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
  });
  return memories.map(toDiaryMemory);
}

export async function createMemory(input: MemoryInput) {
  const data = memoryInputSchema.parse(input);
  return toDiaryMemory(await db.memory.create({ data: { ...data, occurredAt: new Date(`${data.occurredAt}T00:00:00.000Z`) }, include: includeImages }));
}

export async function updateMemory(id: string, input: MemoryInput) {
  const data = memoryInputSchema.parse(input);
  const memory = await db.memory.update({ where: { id }, data: { ...data, occurredAt: new Date(`${data.occurredAt}T00:00:00.000Z`) }, include: includeImages }).catch(() => null);
  return memory ? toDiaryMemory(memory) : null;
}

export async function deleteMemory(id: string) {
  const memory = await db.memory.findUnique({ where: { id }, select: { id: true, images: { select: { pathname: true } } } });
  if (!memory) return false;
  if (memory.images.length) await del(memory.images.map((image) => image.pathname));
  await db.memory.delete({ where: { id } });
  return true;
}

export async function attachImage(memoryId: string, image: { url: string; pathname: string; alt: string }) {
  return db.memoryImage.create({ data: { memoryId, ...image } });
}
