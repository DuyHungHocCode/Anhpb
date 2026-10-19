# Nhật ký dây leo — thiết kế

## Mục đích

Mở rộng trang thư vintage hiện có thành hai không gian: **Letter** giữ nguyên nội dung thư, và **Nhật ký** ghi lại các cột mốc như lần đầu gặp mặt. Nhật ký phải cảm giác như một hành trình: mỗi kỷ niệm được thêm theo thời gian sẽ tiếp tục mọc xuống dưới thành một dây leo.

## Mục tiêu

- Một menu cố định ở đầu trang, kiểu Dynamic Island, chuyển qua lại giữa `Letter` và `Nhật ký` bằng thao tác chạm/click và animation ngắn.
- `Letter` vẫn dùng bố cục, màu giấy, mực đen và dấu đỏ hiện có.
- `Nhật ký` hiển thị dòng thời gian dây leo dọc: mỗi nút là một kỷ niệm, thẻ kỷ niệm luân phiên hai bên dây.
- Một kỷ niệm có: ngày xảy ra, tiêu đề, ghi chú, và danh sách ảnh.
- Dòng thời gian sắp tăng dần theo ngày xảy ra (rồi theo ngày tạo khi trùng ngày), nên kỷ niệm mới về hiện tại nằm ở cuối; một kỷ niệm nhập lùi ngày sẽ vào đúng vị trí lịch sử.
- Người xem mở URL có thể xem nhật ký mà không cần đăng nhập.
- Chế độ chỉnh sửa cho phép thêm, sửa và xoá kỷ niệm, upload ảnh từ web sau khi nhập một mã bí mật dùng chung.

## Ngoài phạm vi

- Không có tài khoản, email, đăng ký, phân vai, chia sẻ theo người dùng, hay trang quản trị riêng.
- Không có kéo-thả đổi thứ tự, phản ứng/bình luận, tìm kiếm, hay chỉnh sửa ảnh.
- Không có URL ảnh riêng tư hoặc CDN ký URL trong phiên bản đầu; ảnh là nội dung công khai như trang Nhật ký.
- Mỗi kỷ niệm tối đa 8 ảnh; mỗi ảnh tối đa 10 MB. Tiêu đề tối đa 120 ký tự, ghi chú tối đa 5.000 ký tự.

## Trải nghiệm giao diện

Sau phần mở phong bì hiện có, menu dạng viên thuốc đặt cố định gần đỉnh trang. Nó gồm hai nhãn `LETTER` và `NHẬT KÝ`; nền tối và phần được chọn là một vùng sáng trượt giữa hai nhãn. Chuyển trang không tải lại toàn bộ ứng dụng.

Trang Nhật ký tiếp tục nền giấy có vân của trang Letter. Phần tiêu đề ở giữa ghi “Những ngày của chúng mình”. Dây leo màu xanh lá trầm uốn dọc màn hình, có lá và các nút dấu đỏ nhạt. Mỗi nút nối với một thẻ giấy cổ chứa ngày, tiêu đề, ghi chú và ảnh. Trên điện thoại, thẻ xếp một cột, dây leo nằm lệch trái để nội dung còn dễ đọc. Nút thêm kỷ niệm chỉ xuất hiện trong chế độ chỉnh sửa.

## Dữ liệu và lưu trữ

Vercel không có ổ đĩa bền vững cho ảnh upload hoặc SQLite, do đó không lưu file trong `public/` hay filesystem runtime.

- **Vercel Blob** lưu bytes ảnh. Client upload qua URL upload tạm do server tạo; server kiểm tra mã chỉnh sửa trước khi cấp URL. Giới hạn loại file là ảnh và giới hạn dung lượng trước khi upload.
- **Postgres hosted** thay SQLite hiện tại, lưu kỷ niệm và URL Blob. Lựa chọn mặc định là Postgres tích hợp Vercel để giảm số dịch vụ cần cấu hình.
- Khi xoá ảnh hoặc kỷ niệm, server xoá Blob tương ứng trước/sau khi cập nhật dữ liệu để không để rác. Nếu xoá Blob thất bại, thao tác phải báo lỗi thay vì âm thầm tạo dữ liệu mồ côi.

Các bảng tối thiểu:

- `Memory`: `id`, `title`, `note`, `occurredAt`, `createdAt`, `updatedAt`.
- `MemoryImage`: `id`, `memoryId`, `url`, `pathname`, `alt`, `createdAt`.

`pathname` là định danh Blob cần thiết để xoá ảnh, không chỉ URL.

Schema Prisma hiện có dùng SQLite nhưng chưa chứa dữ liệu Nhật ký. Trước khi đổi provider, phải export/backup dữ liệu SQLite đang có (`User`, `Post`) và nạp lại vào Postgres nếu môi trường hiện tại có dữ liệu cần giữ; không dùng lệnh reset database production.

## Quyền chỉnh sửa

Người xem có thể đọc tất cả dữ liệu public. Không có đăng nhập. Một mã bí mật duy nhất trong biến môi trường Vercel được gửi chỉ khi người dùng bật chế độ chỉnh sửa. Server so sánh mã này và tạo một cookie phiên HttpOnly ngắn hạn; client không giữ mã sau khi xác thực. Mọi endpoint tạo URL upload, tạo/sửa/xoá kỷ niệm và xoá ảnh đều bắt buộc cookie này.

Đây là rào chắn cho một nhật ký cá nhân nhỏ, không phải mô hình nhiều người dùng hoặc bảo vệ chống người biết mã. Mã phải dài, ngẫu nhiên và không commit vào repository.

## Cấu hình Vercel

Biến môi trường cần thiết:

- `POSTGRES_PRISMA_URL` (hoặc URL kết nối Postgres được chọn) cho Prisma.
- `BLOB_READ_WRITE_TOKEN` cho Vercel Blob server-side.
- `DIARY_EDIT_SECRET` cho cookie phiên chỉnh sửa.

Ảnh Blob và dữ liệu Postgres cần được tạo/kết nối trong Vercel trước khi deploy. Biến môi trường phải được đặt cả Production và Preview nếu muốn thử upload ở Preview.

## Thành phần kỹ thuật

- Chuyển `src/app/page.tsx` thành client component chỉ ở mức cần thiết để đổi tab và trạng thái chỉnh sửa; các phần trang trí SVG hiện có được giữ lại.
- Tạo component `Diary` nhỏ cùng các API route cho memories, session mã chỉnh sửa, và upload/xoá ảnh.
- Dùng Prisma hiện có, cập nhật schema và migration từ SQLite sang Postgres. Không thêm thư viện UI hay thư viện upload; dùng `fetch`, `<input type="file">`, Vercel Blob SDK và các component hiện có.
- Validate dữ liệu API bằng Zod đã có: tiêu đề, ngày, ghi chú, số ảnh, MIME type, dung lượng, và mã phiên.

## Kiểm tra hoàn thành

1. Letter mở và hiển thị như trước; tab đổi mượt sang Nhật ký và quay lại được trên desktop/mobile.
2. Kỷ niệm mẫu hiển thị đúng thứ tự và dòng dây leo nối tiếp khi có nhiều thẻ.
3. Người chưa xác thực không thấy nút chỉnh sửa và nhận lỗi từ các API ghi dữ liệu.
4. Nhập đúng mã cho phép thêm kỷ niệm, upload ảnh, xem ảnh sau khi reload, sửa và xoá.
5. Sai định dạng/quá dung lượng ảnh bị chặn trước khi lưu; lỗi upload hiển thị cho người dùng.
6. `lint`, type check và production build chạy thành công.

## Các quyết định của người dùng

- Dùng thiết kế menu Dynamic Island và dòng thời gian dây leo đã duyệt trong mockup.
- Không cần luồng đăng nhập cho người xem.
- Chế độ chỉnh sửa được bảo vệ bằng một mã bí mật dùng chung.

## Các lựa chọn mặc định của người thực hiện

- Dùng Vercel Blob + Postgres tích hợp Vercel, vì app đã deploy Vercel và đây là ít dịch vụ nhất.
- Ảnh và Nhật ký là public; không xây quyền riêng tư theo từng ảnh.
- Không xây tài khoản hay trang quản trị riêng.
