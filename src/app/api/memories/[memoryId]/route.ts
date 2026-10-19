import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/edit-session";
import { deleteMemory, updateMemory } from "@/lib/memories";

type Context = { params: Promise<{ memoryId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireEditorSession();
    const memory = await updateMemory((await params).memoryId, await request.json());
    return memory ? NextResponse.json(memory) : NextResponse.json({ error: "Không tìm thấy kỷ niệm" }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_EDITOR") return NextResponse.json({ error: "Chưa bật chế độ chỉnh sửa" }, { status: 401 });
    return NextResponse.json({ error: "Dữ liệu kỷ niệm không hợp lệ" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await requireEditorSession();
    return (await deleteMemory((await params).memoryId)) ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Không tìm thấy kỷ niệm" }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_EDITOR") return NextResponse.json({ error: "Chưa bật chế độ chỉnh sửa" }, { status: 401 });
    return NextResponse.json({ error: "Không thể xoá kỷ niệm" }, { status: 500 });
  }
}
