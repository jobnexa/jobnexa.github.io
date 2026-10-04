# JobNexa

**Cách đăng/gỡ tin đơn giản trên GitHub:** [Hướng dẫn hằng ngày](HUONG_DAN_HANG_NGAY.md). Website: [https://jobnexa.github.io/](https://jobnexa.github.io/).

Website giới thiệu việc làm được chủ website chọn và đăng thủ công. Người xem đọc thông tin rồi ứng tuyển tại website nguồn. **Một việc làm = một file Markdown.** Không có scraping, import tự động, database, CMS, tài khoản hay nơi nhận hồ sơ.

Giao diện công khai chỉ dùng tiếng Anh, theo mẫu thẻ trắng/viền tím nhạt. Khi mở trang chủ hoặc danh sách, người dùng chọn kỹ năng rồi bấm **Show recommendations**. **Recommended** chỉ hiển thị tin có ít nhất một kỹ năng khớp, xếp theo số kỹ năng khớp, tỷ lệ kỹ năng yêu cầu được đáp ứng, rồi ngày đăng mới nhất. Nhãn `2 of 3 skills match` là số kỹ năng khớp, không phải đánh giá ứng viên hoặc bảo đảm tuyển dụng. **All active jobs** xem toàn bộ tin đang tuyển; **Choose skills** thay lựa chọn. Kỹ năng đã chọn được lưu trong trình duyệt trên thiết bị đó, không gửi lên máy chủ.

Trạng thái bàn giao và bằng chứng kiểm thử nằm trong `TASK_STATUS.md` và báo cáo `qa/`.

## How to run locally

Cài Node.js 24 và Git. Mở terminal tại thư mục project rồi chạy:

```powershell
npm install
npm run dev
```

Mở địa chỉ terminal in ra. Khi cài lại project từ Git với lockfile đã có, dùng `npm ci` thay `npm install`.

```powershell
npm run dev:samples
```

Lệnh trên dành cho xem giao diện với SAMPLE / DEVELOPMENT DATA, không phải tin thật. Các ví dụ nằm ngoài thư mục việc làm thật và không được xuất bản bởi production build. Bản production chưa có tin thật sẽ hiển thị trạng thái trống trung thực.

## How to add a new job

1. Copy `templates/job-template.md`.
2. Dán bản copy vào `src/content/jobs/`.
3. Đổi tên thành tên ngắn, duy nhất, chữ thường không dấu, nối bằng `-`, ví dụ `lap-trinh-vien-ten-cong-ty.md`. Không tạo thư mục con. Tên file tạo URL `/jobs/lap-trinh-vien-ten-cong-ty/`.
4. Giữ hai dòng `---`: phần giữa hai dòng là thông tin có cấu trúc; phần sau là mô tả.
5. Điền `title` và `company` bằng thông tin bạn đã xác nhận.
6. Điền `location`, `workType`, `employmentType`, `category`.
7. Điền `sourceName` và `sourceUrl`: tên nguồn và URL nơi bạn lấy thông tin.
8. Điền `applyUrl`: địa chỉ chính xác bạn muốn nút **Apply** dẫn tới. Website không tự tìm hay thay liên kết này.
9. Điền `publishedDate` dạng `"2026-10-03"` với ngày phù hợp. Nếu biết ngày hết hạn, điền `expirationDate`; nếu không biết, giữ `null`.
10. Nếu nguồn có mức lương, điền số, tiền tệ và chu kỳ lương. Nếu không có, giữ các trường lương `null`.
11. Viết mô tả thật bằng tiếng Anh ở dưới dòng `---` thứ hai để giữ website đồng nhất ngôn ngữ. Có thể dùng `## Requirements`, `## Benefits`, đoạn văn, `- danh sách`, `**chữ đậm**`, `[tên liên kết](https://...)`. Tên riêng của công ty/địa điểm giữ chính xác theo nguồn.
12. Kiểm tra nội dung. Đổi `draft: true` thành `draft: false` khi sẵn sàng đăng; tin thật để `sample: false`, `status: "active"`.
13. Lưu file. Chạy `npm run validate-jobs`; sửa các lỗi được chỉ rõ. Có thể xem thử bằng `npm run dev`.
14. Nếu muốn kiểm tra đầy đủ: `npm run build`, sau đó `npm run preview`.
15. Commit và push:

```powershell
git add src/content/jobs/lap-trinh-vien-ten-cong-ty.md
git commit -m "Them tin tuyen dung"
git push
```

16. Sau khi GitHub đã được thiết lập theo phần Deploy, mở tab Actions để xem build/deploy. Chỉ khi workflow thành công bản online mới được cập nhật. Mở trang việc để đối chiếu nội dung và link.

Không cần sửa component, TypeScript, danh sách category hoặc navigation. Công ty, địa điểm, ngành và tags được lấy từ tin đang hoạt động.

### Điền metadata

- `title`, `company`, `location`, `employmentType`, `category`, `sourceName`: chuỗi bắt buộc, không bỏ trống.
- `workType`: chỉ `Remote`, `Hybrid`, `On-site`.
- `employmentType`: ví dụ `Full-time`, `Part-time`, `Contract`, `Internship`, `Freelance`; có thể dùng loại phù hợp khác.
- `sourceUrl`, `applyUrl`: URL đầy đủ bắt đầu bằng `https://` hoặc `http://`. Không nhúng username/password vào URL.
- `publishedDate`: ngày lịch đúng dạng `YYYY-MM-DD`, có dấu nháy. Tin công khai không dùng ngày tương lai.
- `expirationDate`: ngày cuối còn hiệu lực, hoặc `null`; không trước ngày đăng.
- `salaryMin`, `salaryMax`: số không âm, không viết dấu phân cách hàng nghìn hoặc ký hiệu tiền tệ. Có thể chỉ nhập một đầu khoảng; nếu cả hai thì min không vượt max.
- `currency`: mã tiền tệ, ví dụ `VND` hoặc `USD`, bắt buộc khi có lương.
- `salaryPeriod`: `hour`, `day`, `month`, `year`, `project`, bắt buộc khi có lương.
- `tags`: danh sách chuỗi; dùng `[]` nếu không có.
- `skills`: kỹ năng yêu cầu bằng tiếng Anh, ví dụ `["Python", "SQL", "Data Analysis"]`; danh sách chọn được tổng hợp từ các tin đang tuyển. Dùng tên nhất quán giữa các tin. Khi `skills` trống, hệ thống dùng `tags` để tương thích tin cũ; nên khai báo kỹ năng rõ ràng cho tin mới.
- `openings`: số vị trí tuyển, số nguyên dương, hoặc `null` khi nguồn không cung cấp. Website không tự đoán số này.
- `featured`: true để hiện nhãn **Featured** trên thẻ; không có nghĩa là tài trợ.
- `sponsored`: true khi tin được tài trợ; website hiển thị nhãn minh bạch.
- `draft`: true/false không đặt trong dấu nháy; bắt buộc.
- `status`: `active`, `expired`, `archived`.
- `sample`: tin thật false, mẫu thử true. Mẫu không xuất bản trong production.
- `summary`: có thể thêm tóm tắt do bạn viết. Nếu không có, website lấy đoạn mô tả để tóm tắt, không sinh mô tả mới bằng AI.

Không tự thêm field lạ: validator báo lỗi để bắt lỗi chính tả. Viết giá trị văn bản trong dấu nháy; nếu có dấu nháy kép bên trong, dùng dấu nháy đơn bọc ngoài. Không dùng tab để thụt dòng YAML. Giữ mô tả ở ngoài frontmatter.

Template trắng không phải tin hợp lệ để build ngay: cần điền đủ thông tin. Bản nháp vẫn được kiểm định khi nằm trong `src/content/jobs/`. Bạn có thể chuẩn bị file chưa hoàn chỉnh ngoài thư mục này, rồi chuyển vào khi đã điền đủ.

## How to edit a job

Mở đúng file trong `src/content/jobs/`, sửa metadata hoặc phần mô tả, lưu, validate, commit và push. Tránh đổi tên file đã chia sẻ vì đổi tên đồng nghĩa đổi URL. Không sửa trực tiếp file trong `dist/` vì build sẽ tạo lại.

## How to change an application link

Trong file của tin, sửa duy nhất giá trị `applyUrl` thành URL mới do bạn xác nhận. Nếu nguồn cũng thay đổi, sửa `sourceUrl` riêng. Lưu, validate, commit/push. Nút ứng tuyển dùng nguyên URL bạn nhập, không cần sửa UI.

## How to remove a job

- Gỡ tạm để chuẩn bị lại: đặt `draft: true`.
- Lưu trữ nhưng giữ file trong repository: đặt `status: "archived"`.
- Gỡ hẳn: xóa file Markdown.

Commit/push để cập nhật website. Tin sẽ bị loại khỏi HTML, search index và sitemap trong bản build mới; URL cũ trở thành không tìm thấy. Nếu repository công khai, file nháp/lịch sử Git vẫn có thể được người khác đọc trên GitHub: draft chỉ ẩn khỏi website, không bảo mật repository.

## How to mark a job expired

Đặt `status: "expired"` để đánh dấu ngay, hoặc điền `expirationDate`. Ngày hết hạn tính theo UTC+7, còn hiệu lực đến hết ngày đã nhập. Không có ngày thì website không đoán.

Tin hết hạn bị loại khỏi danh sách đang tuyển, search và sitemap. Trang chi tiết được giữ với nhãn **Expired**, không có nút ứng tuyển, và chỉ dẫn công cụ tìm kiếm không lập chỉ mục. Liên kết nguồn vẫn có để kiểm tra lại.

**Giới hạn website tĩnh:** HTML và sitemap được cập nhật khi build/deploy. JavaScript có thể cập nhật trạng thái hết hạn khi người xem mở trang, nhưng không thay thế rebuild cho crawler hoặc người dùng tắt JavaScript. Khi cần cập nhật snapshot mà không sửa nội dung, chạy lại workflow bằng nút Run workflow trên GitHub. Không có cron hoặc tự động lấy việc.

Muốn mở lại tin: kiểm tra nguồn, đổi status active và sửa/bỏ ngày hết hạn cho đúng, rồi commit/push.

## How to make a job draft

Đặt `draft: true`. Sau deploy thành công, tin không có trang chi tiết công khai, thẻ việc, search record hoặc sitemap entry. Khi sẵn sàng đăng lại, đặt false; các trường bắt buộc vẫn phải hợp lệ.

## How to feature a job

Đặt `featured: true`. Tin chỉ hiện ở nhóm nổi bật nếu công khai và còn hiệu lực. Đổi false để bỏ nổi bật. Không cần chỉnh homepage.

## How to validate jobs

```powershell
npm run validate-jobs
```

Validator đọc file local, không gọi website nguồn. Lỗi được báo theo file, field và lý do. Ví dụ `applyUrl` thiếu giao thức, ngày không tồn tại, boolean bị viết thành chuỗi, lương min lớn hơn max. Sửa file rồi chạy lại.

Trùng slug/tên file là lỗi. Trùng link ứng tuyển hoặc tổ hợp tên/công ty/địa điểm có thể là cảnh báo vì nhiều vị trí dùng chung trang nguồn. Kiểm tra lại nội dung cảnh báo trước khi đăng. URL đúng định dạng không bảo đảm tin còn tuyển; owner và người ứng tuyển phải kiểm tra nguồn.

## How to build

```powershell
npm run build
npm run preview
```

Build bắt buộc kiểm định nội dung và xuất website tĩnh vào `dist/`. Preview mở bản build để kiểm tra, không đưa website lên mạng. `npm run dev` dành cho chỉnh sửa hằng ngày. Không commit node_modules hoặc dist.

## How to deploy

Website được chuẩn bị cho GitHub Pages. Không cần hosting server, CMS hoặc khóa API. Bạn cần repository GitHub và quyền bật Pages; việc kết nối lần đầu không tự xảy ra khi chỉ chạy local.

1. Mở repository [jobnexa/jobnexa.github.io](https://github.com/jobnexa/jobnexa.github.io). Không đưa node_modules/dist vào Git.
2. Trong repository, kiểm tra Settings → Pages → Source: GitHub Actions.
3. Dùng nhánh `main` theo workflow mặc định; nếu dùng tên khác thì chỉnh cấu hình workflow một lần.
4. Push thay đổi; theo dõi workflow ở Actions. Validation, tests và build phải thành công trước khi upload/deploy.
5. Mở URL Pages trong kết quả deploy, kiểm tra homepage, jobs và trang chi tiết. Build local thành công không đồng nghĩa đã deploy online.

JobNexa dùng địa chỉ gốc `https://jobnexa.github.io/`. Workflow/config phải dùng origin `https://jobnexa.github.io` và base path `/`.

Cấu hình URL dùng `SITE_URL` (origin) và `BASE_PATH` (tiền tố đường dẫn). Để thử local với địa chỉ website trong PowerShell:

```powershell
$env:SITE_URL = "https://jobnexa.github.io"
$env:BASE_PATH = "/"
npm run build
npm run preview
```

Các giá trị trên là địa chỉ đã chọn cho JobNexa. Khi quay lại chế độ local ở root, xóa hai biến trong terminal:

```powershell
Remove-Item Env:SITE_URL -ErrorAction SilentlyContinue
Remove-Item Env:BASE_PATH -ErrorAction SilentlyContinue
```

Không bật `INCLUDE_SAMPLES` khi build production; build sẽ từ chối. Chỉ lệnh `dev:samples` sử dụng chế độ mẫu.

Workflow chạy khi push main hoặc bấm Run workflow; pull request chỉ kiểm tra. Không có scheduled scraper/rebuild, không dùng agent khi đăng tin thường ngày. Nếu validation/build thất bại, sửa file được báo rồi push lại; bản online trước đó tiếp tục hoạt động.

Repository là [jobnexa/jobnexa.github.io](https://github.com/jobnexa/jobnexa.github.io). Với công việc đăng/gỡ tin thường ngày, làm trực tiếp trên GitHub theo [hướng dẫn hằng ngày](HUONG_DAN_HANG_NGAY.md). Workflow tự đọc URL Pages đã cấu hình; nếu cần ghi đè, đặt repository variables `SITE_URL` và `BASE_PATH` trong Settings → Secrets and variables → Actions → Variables. Chỉ cần cấu hình một lần.

Ở địa chỉ gốc này, `robots.txt` và sitemap nằm ngay dưới `https://jobnexa.github.io/`.

## Kiểm tra và bằng chứng

Xem `TASKS.md` cho tiêu chí nghiệm thu và `qa/` cho kết quả. Những thông tin về công ty, mức lương và mô tả mẫu chỉ dùng kiểm thử; không phải cơ hội tuyển dụng thật. Website không yêu cầu thanh toán để ứng tuyển và không bảo đảm tin còn mở tại nguồn.

- `npm test`: kiểm tra schema, metadata, URL, Markdown và policy.
- `npm run check`: kiểm tra TypeScript/Astro.
- `npm run test:owner`: chạy chuỗi build thêm/sửa/nháp/hết hạn/xóa trong bản sao cách ly tại `qa/tmp/`; không đổi tin thật. Mất lâu hơn build thường; không cần chạy mỗi lần đăng tin. Log tại `qa/build-logs/`, kết quả tại `qa/owner-workflow.json`.

Tên website và phần giới thiệu mặc định nằm trong `src/lib/site.ts`; đổi ở đây một lần khi đặt thương hiệu, không cần sửa khi đăng việc.

### Dependency audit

Kết quả audit khi bàn giao còn cảnh báo high từ dependency gián tiếp `http-cache-semantics` được Astro dùng. Bản phát hành kiểm tra chưa có bản vá phù hợp; không tự downgrade toàn bộ Astro theo `npm audit fix --force`. Website xuất file tĩnh, không chạy backend cache theo tài khoản. Xem `qa/dependency-audit.json` và báo cáo QA; cập nhật dependency có kiểm thử khi có bản vá.

## Đăng ký thông báo email

Nút **Sign Up** và hộp chào đầu phiên sử dụng chung một biểu mẫu email. Hiện chưa kết nối dịch vụ: không lưu/gửi email và không báo đăng ký thành công. Để kết nối endpoint biểu mẫu HTTPS công khai và hiểu bước gửi newsletter riêng, xem [hướng dẫn kết nối email](HUONG_DAN_KET_NOI_EMAIL.md).
