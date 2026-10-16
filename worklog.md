# Worklog

---
Task ID: 1
Agent: Super Z (main agent)
Task: Tạo giao diện web retro vintage (HTML/CSS) theo yêu cầu: font Courier Prime, nền giấy cổ #f7f5f0 có vân nhám, chữ mực #2b2b2b, layout editorial tối giản.

Work Log:
- Khởi tạo môi trường fullstack Next.js 16 (init-fullstack.sh)
- Nghiên cứu font: Courier Prime (Google Fonts v11 + bản gốc trên GitHub) KHÔNG chứa glyph tiếng Việt tổ hợp (ế, ộ, ơ, ư... — dải U+1EA0–1EF1 và combining marks đều thiếu). Giải pháp: font stack metric-compatible "Courier Prime" → "Courier New" (Win/mac) → "Liberation Mono" (Linux, đã verify có đủ tiếng Việt) → Noto Sans Mono → monospace; next/font với fallback list + adjustFontFallback: false
- Viết src/app/layout.tsx: load Courier Prime (400/700, normal/italic, latin+latin-ext) qua next/font, gắn biến font lên <html>, metadata + lang="vi"
- Viết src/app/vintage.css: nền giấy #f7f5f0 với radial gradients ố vàng, lớp noise SVG feTurbulence (mix-blend multiply) cố định phủ trang, vignette rìa giấy, đường kẻ báo cũ (thick-thin double rule), masthead chữ loang mực, drop cap, 3 cột có column-rule, hộp viền đôi, rao vặt viền nét đứt, responsive 980/900/640px, print styles
- Viết src/app/page.tsx: trang báo giả tưởng "Tiếng Máy Chữ" — topbar, masthead, mục lục, bài chính 5 đoạn, pull quote, 3 cột tin ngắn (cổ vật / bí kíp bảo tồn / thư ngỏ + thời tiết), 4 ô rao vặt, colophon; semantic HTML (header/nav/main/article/blockquote/footer + aria)
- Fix bug scoping: biến --font-courier-prime gắn trên body nhưng --font-typewriter khai báo ở :root → font rơi về system sans; chuyển className biến font lên <html>
- Fix 2 lỗi chính tả nội dung ("hô hào", "xin để lại")
- Lint sạch; dev.log 200 OK, không lỗi runtime
- Agent Browser verify: desktop 1280px (top/mid/bottom screenshots), anchor nav hoạt động (click "Rao vặt" → scroll đúng), mobile 375px (cột thu về 1, topbar căn giữa), console không có error, document.fonts.check('Courier Prime') = true

Stage Summary:
- Deliverable: trang web retro vintage "Tiếng Máy Chữ" chạy tại route / của Next.js project
- File chính: src/app/layout.tsx, src/app/page.tsx, src/app/vintage.css
- Ảnh xác minh: download/vintage-desktop-top.png, vintage-desktop-mid.png, vintage-desktop-bottom.png, vintage-mobile.png
- Quyết định quan trọng: fallback font metric-compatible do Courier Prime gốc không hỗ trợ tiếng Việt

---
Task ID: 2
Agent: Super Z (main agent)
Task: Chuyển trang thành lá thư vintage cho một cô gái — dòng "Hãy tự tin vào bản thân và sự cố gắng của mình." nổi bật nhất, đoạn "đừng biến mất nhé..." ở lá thư tiếp theo, thiệp có hoa văn bo viền.

Work Log:
- Sửa layout.tsx: metadata mới "Một Lá Thư — Hãy tự tin vào bản thân và sự cố gắng của mình"
- Rewrite vintage.css: hệ thống thiệp bo viền 3 lớp (::before đường mảnh ngoài, ::after đường mảnh trong, .pearl-ring chấm tròn giữa) + border-radius (bo viền), 4 hoa văn góc SVG lật 4 hướng, tem thư mép xước ke (4 lớp radial-gradient đục lỗ không cần mask), con dấu bưu cục SVG textPath tròn, gạch chân tay SVG dưới hero, animation card-in/soft-in (có prefers-reduced-motion), responsive 560px
- Rewrite page.tsx: 2 thiệp — Lá thư 1 (ngày, "Gửi cậu,", HERO LINE to đậm gạch tay, câu dẫn chuyển thư) + Lá thư tiếp theo (đoạn "đừng biến mất nhé..." nguyên văn, nhấn italics "đừng biến mất nhé", chữ ký "Thương, — Tớ.", P/s.) + letterhead/footer
- Fix: quên import "./vintage.css" trong lần rewrite đầu → trang render HTML trần; phát hiện qua document.styleSheets không có rule của vintage.css
- Fix mobile: dòng ngày bị tem đè → thêm padding-right 84px cho .letter-date ở 560px
- Nudge vị trí postmark (right 100px) để chữ "5 xu" trên tem dễ đọc
- Agent Browser verify: desktop 1280 (đầu/giữa/cuối), mobile 375 — khung hoa văn, tem, dấu, hero đều chuẩn; console sạch

Stage Summary:
- Deliverable: trang lá thư vintage 2 thiệp bo viền hoa văn, giữ nguyên hệ nền giấy cổ + Courier Prime của phiên bản báo
- File: src/app/page.tsx, src/app/vintage.css, src/app/layout.tsx
- Ảnh xác minh: download/letter-desktop.png, letter-desktop-bottom.png, letter-mobile.png

---
Task ID: 3
Agent: main
Task: Bỏ chữ "Thương," ở phần ký tên của lá thư

Work Log:
- Edit src/app/page.tsx: xóa "Thương," và <br /> trong .signoff, chỉ giữ lại "— Tớ."
- Verify: curl trang chủ → không còn "Thương", chữ ký "— Tớ." hiển thị bình thường, server 200 OK

Stage Summary:
- Phần ký tên giờ chỉ còn hoa văn flourish + "— Tớ."
