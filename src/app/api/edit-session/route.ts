import { NextResponse } from "next/server";
import {
  createEditSession,
  EDIT_SESSION_COOKIE,
  editorSessionMaxAge,
  secretsMatch,
} from "@/lib/edit-session";

export async function POST(request: Request) {
  const configuredSecret = process.env.DIARY_EDIT_SECRET;
  if (!configuredSecret) return NextResponse.json({ error: "Chưa cấu hình mã chỉnh sửa" }, { status: 500 });

  const body = await request.json().catch(() => null);
  if (typeof body?.secret !== "string" || !secretsMatch(body.secret, configuredSecret)) {
    return NextResponse.json({ error: "Mã chỉnh sửa không đúng" }, { status: 401 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(EDIT_SESSION_COOKIE, createEditSession(), {
    httpOnly: true,
    maxAge: editorSessionMaxAge(),
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export function DELETE() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(EDIT_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
