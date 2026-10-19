import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/edit-session";
import { createMemory } from "@/lib/memories";

export async function POST(request: Request) {
  try {
    await requireEditorSession();
    const memory = await createMemory(await request.json());
    return NextResponse.json(memory, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_EDITOR") return NextResponse.json({ error: "Chưa bật chế độ chỉnh sửa" }, { status: 401 });
    return NextResponse.json({ error: "Dữ liệu kỷ niệm không hợp lệ" }, { status: 400 });
  }
}
