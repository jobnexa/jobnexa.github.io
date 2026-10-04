# Đăng và gỡ việc làm hằng ngày trên JobNexa

Website: [https://jobnexa.github.io/](https://jobnexa.github.io/). Mỗi tin là một file Markdown. Bạn chỉ cần trình duyệt và quyền sửa repository GitHub; không cần mở terminal hoặc tạo nhánh riêng.

## Thêm một tin

1. Mở [thư mục việc làm trên GitHub](https://github.com/jobnexa/jobnexa.github.io/tree/main/src/content/jobs). Chọn **Add file → Create new file**. Đặt tên file ngắn, duy nhất, chữ thường không dấu, nối bằng dấu `-`, ví dụ `data-analyst-cong-ty-abc.md`. Nếu tạo từ trang gốc repository, nhập đường dẫn `src/content/jobs/data-analyst-cong-ty-abc.md`.
2. Mở [mẫu đơn giản](https://github.com/jobnexa/jobnexa.github.io/blob/main/templates/job-simple.md), bấm **Raw**, sao chép toàn bộ và dán vào file mới. Mẫu có `draft: true` và `sample: true`, nên chưa hiện trên website.
3. Thay **tất cả** chữ `REPLACE` và hai URL `example.com` bằng dữ liệu đã kiểm tra tại nguồn thật. Điền `title`, `company`, `location`, `employmentType`, `category`, `sourceName`; chọn `workType` đúng một trong `Remote`, `Hybrid`, `On-site`. `sourceUrl` phải dẫn đến tin gốc, `applyUrl` đến nơi ứng tuyển; dùng URL HTTPS đầy đủ. JobNexa không nhận hồ sơ ứng tuyển.
4. Thay `publishedDate` bằng ngày đăng phù hợp, có dấu nháy và dạng `"YYYY-MM-DD"` (ví dụ `"2026-10-03"`); tin công khai không dùng ngày tương lai. Điền `skills: ["Python", "SQL"]` chỉ với kỹ năng được tin gốc hỗ trợ, dùng cùng một cách viết giữa các tin để gợi ý khớp chính xác. Nếu chưa xác minh kỹ năng, giữ `skills: []`. Chỉ thêm `openings: 3` khi nguồn xác nhận số vị trí; nếu không biết thì bỏ trường này.
5. Viết mô tả **bằng tiếng Anh** sau dòng `---` thứ hai. Xóa đoạn hướng dẫn của mẫu. Giữ tên riêng theo nguồn, không tự thêm điều kiện, lương hoặc số vị trí.
6. Kiểm tra lại toàn bộ rồi đổi **cả hai** dòng thành `draft: false` và `sample: false` để công khai. Trong phần **Commit changes**, chọn commit trực tiếp vào `main` và bấm **Commit changes**.
7. Mở [Actions](https://github.com/jobnexa/jobnexa.github.io/actions). Chờ workflow **Validate and deploy GitHub Pages** thành công, rồi mở trang JobNexa kiểm tra tiêu đề, nội dung và nút **Apply**. Nếu workflow báo lỗi, mở log để xem file/trường cần sửa, sửa trên GitHub và commit lại; bản online trước đó vẫn giữ nguyên đến khi deploy thành công.

**Lương là tùy chọn.** Nếu nguồn xác nhận, thêm cả bốn dòng vào phần giữa hai dấu `---`: `salaryMin: 1000`, `salaryMax: 1500`, `currency: "USD"`, `salaryPeriod: "month"`. Số tiền không có dấu phân cách hay ký hiệu; `salaryPeriod` chỉ nhận `hour`, `day`, `month`, `year`, `project`. Nếu không có lương đã xác minh, bỏ cả bốn dòng. `expirationDate: "YYYY-MM-DD"` cũng tùy chọn; ngày này không được trước ngày đăng.

## Sửa, ẩn, hết hạn hoặc xóa

- **Sửa:** mở file tương ứng trong [thư mục việc làm](https://github.com/jobnexa/jobnexa.github.io/tree/main/src/content/jobs), bấm biểu tượng bút chì, sửa và commit vào `main`. Tránh đổi tên file vì tên file là một phần URL.
- **Ẩn tạm:** đổi `draft: true`, rồi commit. File vẫn nằm trên GitHub nhưng không xuất hiện trên website sau deploy. Repository công khai không phải nơi lưu thông tin bí mật.
- **Đánh dấu hết hạn:** thêm hoặc đổi `status: "expired"`, rồi commit. Tin rời danh sách đang tuyển; trang chi tiết còn để tham khảo nhưng không có nút ứng tuyển. Muốn lưu trữ hoàn toàn, dùng `status: "archived"`.
- **Xóa hẳn:** mở file trên GitHub, chọn menu **… → Delete file** (hoặc biểu tượng thùng rác), rồi **Commit changes** vào `main`. Sau khi Actions deploy thành công, tin và URL chi tiết sẽ được gỡ.

Sau mỗi commit, kiểm tra [Actions](https://github.com/jobnexa/jobnexa.github.io/actions). Việc thêm, sửa, ẩn và xóa đều chỉ cập nhật website khi deploy thành công.

Muốn bật ô đăng ký email, xem [hướng dẫn kết nối email](HUONG_DAN_KET_NOI_EMAIL.md).
