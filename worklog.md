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
