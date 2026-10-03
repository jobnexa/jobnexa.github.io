# DECISIONS — Phase 1

Ngày 03/10/2026. Hợp đồng thiết kế Phase 1 đã được dùng để triển khai. Trạng thái hiện tại xem TASK_STATUS.md.

1. **Astro static + Markdown + GitHub Pages.** Hợp yêu cầu quản lý bằng file, không backend. Không dùng Sites hosting vì owner chỉ định GitHub Pages.
2. **Git là nơi quản lý nội dung duy nhất.** Không scraping/import/API job/CMS/login/database; không tự tạo nội dung thật, link hay mức lương.
3. **Giữ tên field người dùng đề xuất.** publishedDate, expirationDate, workType; không đổi thành publishedAt/expiresDate/remote để tránh tài liệu và component lệch nhau. Bổ sung salaryPeriod, status, sample, summary tùy chọn.
4. **Một schema, một policy.** CLI và Astro dùng chung validation; frontend không định nghĩa lại quy tắc nghiệp vụ. Tên file là id/slug.
5. **Draft an toàn.** Template draft true; chưa điền xong vẫn lưu được nhưng validation sẽ báo lỗi. File template ngoài collection. Hidden không được lọt vào route, JSON hay sitemap.
6. **Expired giữ detail.** Chọn đề xuất SEO giữ link cũ với nhãn/noindex và bỏ CTA; điều chỉnh đề xuất QA ban đầu “xóa mọi route expired” để thống nhất. Không đưa expired vào active listing/search/sitemap.
7. **Không lịch tự động.** Hết hạn dựa trên UTC+7, snapshot HTML cập nhật khi build. Client chỉ tăng cường trạng thái theo ngày; muốn cập nhật toàn bộ HTML/crawler thì owner chạy lại workflow. Không thêm cron rebuild hoặc hẹn giờ đăng ngoài yêu cầu.
8. **Sample tách riêng.** Preview riêng, banner rõ, production loại bỏ; invalid fixtures không được nằm trong collection thật. Website chưa có job thật vẫn có empty state hợp lệ.
9. **Search local đơn giản.** Không backend/Algolia; tìm không dấu, kết hợp filter, URL query và sort ổn định. Không JS vẫn đọc được HTML, không hứa filter hoạt động.
10. **SEO không giả định compliance.** Không JobPosting schema. Origin/base thực phải được cấu hình trước deploy; không phát hành canonical giả. Robots cấp project path có giới hạn được ghi rõ.
11. **Quản lý xung đột theo file.** A sở hữu core/routes/config; B sở hữu UI/CSS/browser scripts; C SEO endpoints/component; D fixtures/content tests/template; E QA tests/evidence. Agent muốn sửa ngoài ownership gửi patch đề nghị cho owner; không tự sửa đồng thời.
12. **Phạm vi theo lượt.** Lượt đầu chỉ Phase 1; người dùng sau đó yêu cầu triển khai. Source, template, workflow, Git local và tests đã có. Chưa deploy live.
13. **Cache cách ly.** Astro/Vite cache đặt trong .astro của từng project để bản sao QA dùng chung dependency không ghi đè cache.
14. **Phân công thực tế.** B tiếp nhận C với cùng model yêu cầu. E gặp giới hạn sử dụng nên orchestrator hoàn tất owner/browser/integration QA.

Các thông tin có thể điền sau: tên thương hiệu; GitHub owner/repo/nhánh; domain riêng nếu có; nội dung tuyển dụng thực. Đây là cấu hình một lần, không phải việc phải sửa mỗi lần đăng tin.

Tham khảo kỹ thuật đã đọc ngày 03/10/2026: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Kiểm tra lại phiên bản cụ thể khi khóa dependency ở Phase 2.
