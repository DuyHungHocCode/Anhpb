import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGES_PER_MEMORY, uploadPayloadSchema } from "@/lib/diary";
import { requireEditorSession } from "@/lib/edit-session";
import { db } from "@/lib/db";
import { attachImage } from "@/lib/memories";

const allowedContentTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function uploadConstraints(pathname: string, clientPayload: string | null) {
  const { memoryId } = uploadPayloadSchema.parse(clientPayload);
  if (!pathname.startsWith(`memories/${memoryId}/`)) throw new Error("Đường dẫn ảnh không hợp lệ");
  return {
    allowedContentTypes,
    maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
    addRandomSuffix: true,
    tokenPayload: JSON.stringify({ memoryId }),
  };
}

async function memoryCanAcceptImage(memoryId: string) {
  const memory = await db.memory.findUnique({ where: { id: memoryId }, include: { images: { select: { id: true } } } });
  if (!memory) throw new Error("Không tìm thấy kỷ niệm");
  if (memory.images.length >= MAX_IMAGES_PER_MEMORY) throw new Error("Kỷ niệm đã đủ ảnh");
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        await requireEditorSession();
        const constraints = uploadConstraints(pathname, clientPayload);
        await memoryCanAcceptImage(JSON.parse(constraints.tokenPayload).memoryId);
        return constraints;
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { memoryId } = uploadPayloadSchema.parse(tokenPayload);
        await memoryCanAcceptImage(memoryId);
        await attachImage(memoryId, { url: blob.url, pathname: blob.pathname, alt: blob.pathname });
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload ảnh thất bại";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHORIZED_EDITOR" ? 401 : 400 });
  }
}
