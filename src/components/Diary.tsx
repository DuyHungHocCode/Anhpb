"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DiaryMemory } from "@/lib/diary";

export default function Diary({ memories }: { memories: DiaryMemory[] }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  async function unlock() { const response = await fetch("/api/edit-session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret }) }); if (response.ok) setEditing(true); else setError("Mã chỉnh sửa không đúng"); setSecret(""); }
  async function save() { setError(""); const response = await fetch("/api/memories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, note, occurredAt }) }); if (!response.ok) return setError("Không thể lưu kỷ niệm"); const memory = await response.json(); for (const file of Array.from(files ?? [])) await upload(`memories/${memory.id}/${file.name.replace(/[^\w.-]/g, "-")}`, file, { access: "public", handleUploadUrl: "/api/blob", clientPayload: JSON.stringify({ memoryId: memory.id }) }); router.refresh(); setTitle(""); setNote(""); setOccurredAt(""); }
  return <section className="diary" id="diary"><header><p>Những ngày của chúng mình</p><h1>Nhật ký kỷ niệm</h1></header><div className="vine-timeline">{memories.length ? memories.map((memory) => <article className="memory-card" key={memory.id}><time dateTime={memory.occurredAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(memory.occurredAt))}</time><h2>{memory.title}</h2><p>{memory.note}</p><div className="memory-images">{memory.images.map((image) => <img key={image.id} src={image.url} alt={image.alt} />)}</div></article>) : <p>Chưa có kỷ niệm nào, hãy bắt đầu từ một ngày thật đặc biệt.</p>}</div>{editing ? <form className="diary-form" onSubmit={(event) => { event.preventDefault(); void save(); }}><label>Tiêu đề<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>Ngày kỷ niệm<input required type="date" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} /></label><label>Ghi chú<textarea value={note} onChange={(event) => setNote(event.target.value)} /></label><label>Ảnh<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(event) => setFiles(event.target.files)} /></label><button>Lưu kỷ niệm</button></form> : <form className="unlock-form" onSubmit={(event) => { event.preventDefault(); void unlock(); }}><label>Mã chỉnh sửa<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} /></label><button>Bật chỉnh sửa</button></form>}{error && <p role="alert">{error}</p>}</section>;
}
