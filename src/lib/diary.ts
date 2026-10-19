import { z } from "zod";

export const MAX_IMAGES_PER_MEMORY = 8;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const occurredAtSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Ngày kỷ niệm không hợp lệ");

export const memoryInputSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề là bắt buộc").max(120),
  note: z.string().trim().max(5000),
  occurredAt: occurredAtSchema,
});

export type MemoryInput = z.infer<typeof memoryInputSchema>;

export const uploadPayloadSchema = z
  .string()
  .transform((value, context) => {
    try {
      return JSON.parse(value);
    } catch {
      context.addIssue({ code: "custom", message: "Payload upload không hợp lệ" });
      return z.NEVER;
    }
  })
  .pipe(z.object({ memoryId: z.string().cuid() }));

export type DiaryMemory = {
  id: string;
  title: string;
  note: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  images: Array<{
    id: string;
    url: string;
    pathname: string;
    alt: string;
  }>;
};

type MemoryRecord = {
  id: string;
  title: string;
  note: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: string;
    url: string;
    pathname: string;
    alt: string;
  }>;
};

export function toDiaryMemory(memory: MemoryRecord): DiaryMemory {
  return {
    ...memory,
    occurredAt: memory.occurredAt.toISOString(),
    createdAt: memory.createdAt.toISOString(),
    updatedAt: memory.updatedAt.toISOString(),
  };
}
