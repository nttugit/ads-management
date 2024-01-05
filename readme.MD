# Đồ án CNLTHĐ - Ads Management

## Chi tiết

https://hackmd.io/@nndkhoa9/rkYF2FLGT

## Cách sử dụng:

-   Clone source code bằng lệnh "git clone https://github.com/nttugit/ads-management.git"
-   Mở source, chạy lệnh "npm install" tại thư mục gốc của dự án
-   Thêm file .env, copy nội dung từ file .env.example qua và thêm thông tin
-   Chạy chương trình bằng lệnh "npm start" hoặc "nodemon index.js"
-   Mở "/api-docs" để biết thêm về APIs (có thể chưa có cái này)

## Lưu ý khác về mã nguồn:

-   Có soft delete và cả hard delete
-   Lỗi tìm không thấy dữ liệu là 204, nếu tìm không thấy user thì đó là 400
-   Chạy script tạo report solution khi tạo phường mới (xoá trước khi chạy)
