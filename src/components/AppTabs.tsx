"use client";

import { useState, type ReactNode } from "react";
import type { DiaryMemory } from "@/lib/diary";
import Diary from "./Diary";

export default function AppTabs({ children, memories }: { children: ReactNode; memories: DiaryMemory[] }) {
  const [tab, setTab] = useState<"letter" | "diary">("letter");
  return <div className="letter-content">
    <nav className="dynamic-island" aria-label="Chuyển nội dung">
      <button aria-pressed={tab === "letter"} onClick={() => setTab("letter")}>LETTER</button>
      <button aria-pressed={tab === "diary"} onClick={() => setTab("diary")}>NHẬT KÝ</button>
    </nav>
    {tab === "letter" ? children : <Diary memories={memories} />}
  </div>;
}
