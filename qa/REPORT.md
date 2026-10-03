# Báo cáo mới nhất — chuyển sang jobnexa.github.io, 03/10/2026

Website đã được dựng lại và xác minh tại https://jobnexa.github.io/. Repository hiện tại: https://github.com/jobnexa/jobnexa.github.io.

- Repository ID 1402877164 và lịch sử Git được bảo toàn khi chuyển owner/đổi tên. Baseline trước cập nhật là commit 7a81dfcfdc6bc4e792743fcd0b13d96d6696edf5, cây b42b6f7a9b8c5bca324a0e2e8f7bae9b128763cd, đủ 134 file gốc. Không tải lại hoặc thay đổi nội dung ảnh/tin/test đã có.
- Source Pages vẫn là GitHub Actions; UI xác nhận site live ở https://jobnexa.github.io/ và HTTPS bắt buộc. Environment/repository/organization không có biến ghi đè SITE_URL/BASE_PATH.
- Commit cập nhật hướng dẫn 4c3e712d217a3a0b5834a0a2c0516abc700fee11 có đúng ba file README.md, HUONG_DAN_HANG_NGAY.md và TASK_STATUS.md. Workflow tự lấy origin mới và base / từ Pages.
- Lần deploy cho domain mới: https://github.com/jobnexa/jobnexa.github.io/actions/runs/37134338261 — completed / success.
- Build local với SITE_URL=https://jobnexa.github.io, BASE_PATH=/ thành công. 5 HTML tiếng Anh/WorkScout, 57 link/asset nội bộ tồn tại; canonical, sitemap và robots đúng domain gốc; không còn origin cũ hoặc /Job/ trong output.
- Kiểm tra online: 8 route/artifact và 2 asset CSS/JS đều HTTP 200. Canonical, liên kết nội bộ, sitemap và robots đúng domain mới. Search index là []; không có route hay nội dung fixture. Browser xác nhận bảng chọn kỹ năng, navigation ở root và trạng thái 0 jobs.
- Bằng chứng: migration-jobnexa.json, jobnexa-live.png, jobnexa-pages.png. Báo cáo deployment.json và ảnh cũ được giữ làm lịch sử.
- Hướng dẫn thao tác hằng ngày đã cập nhật link repository mới. Thương hiệu vẫn là WorkScout, giao diện công khai chỉ tiếng Anh. Chưa có tin tuyển dụng thật nên chưa thử nút Apply hoặc recommendation với dữ liệu thật trên domain mới.

## Lịch sử — xuất bản WorkScout tại địa chỉ cũ, 03/10/2026

Website đã hoạt động tại https://ducdungeth.github.io/Job/. Mã nguồn và tài liệu ở https://github.com/ducdungeth/Job. Chủ website xác nhận dùng địa chỉ này với thương hiệu WorkScout.

- Pages Source đã lưu thành GitHub Actions; UI xác nhận site live, HTTPS bắt buộc trên domain mặc định.
- Lần deploy đầu tiên: https://github.com/ducdungeth/Job/actions/runs/37131081418, trạng thái completed / success, commit f3338abb82000f4920a7357f9f0a431d313132ec.
- 131 file ban đầu được đối chiếu Git blob SHA với byte trên máy trước cập nhật nhánh main: không có sai lệch. File tạm, dependency/cache và .env không được upload.
- Sau đổi thương hiệu: check 40 files không có errors/warnings/hints; 16/16 tests PASS; build production /Job/ thành công. 5 HTML dùng lang=en; 57 link/asset nội bộ đúng base và tồn tại; canonical/sitemap/robots đúng origin; search-index là [].
- Browser live xác nhận logo W/WorkScout, giao diện tiếng Anh, bảng chọn kỹ năng khi truy cập và trạng thái trống trung thực. Chưa có tin thật nên chưa thể thử recommendation với dữ liệu thật trên website online; hành vi gợi ý đã được kiểm tra bằng fixture ở bản local bên dưới.
- Bằng chứng: deployment.json, screenshots/workscout-live.png, screenshots/github-pages-settings.png. Hướng dẫn browser-only cho owner: ../HUONG_DAN_HANG_NGAY.md, ../templates/job-simple.md.

## Lịch sử — thiết kế lại SkillMatch trước xuất bản, 03/10/2026

Yêu cầu hoàn thành: giao diện theo ảnh mẫu, website chỉ tiếng Anh, người dùng chọn kỹ năng khi lần đầu truy cập rồi nhận gợi ý ở Recommended. Home và Jobs dùng cùng dashboard; trang chi tiết và trang thông tin dùng cùng hệ màu. Chưa deploy online, chưa có tin tuyển dụng thật.

## Bằng chứng mới

- `redesign-check.log`: 40 files, 0 errors/warnings/hints.
- `redesign-tests.log`: 16/16 test nội dung, chính sách công khai, chuẩn hóa kỹ năng, khớp một phần/toàn bộ, loại không khớp, xếp hạng ổn định, hạn tuyển và metadata mới.
- `redesign-build.log`: production exit 0, 5 trang HTML + search/sitemap/robots. Search index rỗng vì chưa có tin thật; không xuất bản mẫu.
- `owner-workflow.json`, `redesign-owner.log`, `build-logs/`: 13/13 tình huống đạt trong bản sao riêng; kiểm tra mới xác nhận skills và openings từ template xuất hiện trong index/thẻ. Chạy thành công khi bản demo cũng đang mở.
- `routes.json`: 25 route/asset checks PASS ở `/` và `/ten-repo/`, gồm HTML lang=en, detail, expired detail, search JSON, robots/sitemap/CSS/JS/favicon.
- `design/reference-colors.json`, `reference-exact-colors.json`, `reference-dna.json`: đo màu bằng clustering xác định và tần suất RGB chính xác, ghi lại các giá trị bố cục suy luận từ ảnh.
- `design/verification.json`: PASS — mean deltaE 2.09, max 19.99, coverage drift 0.0497. Kiểm tra này xác nhận màu trong giới hạn; không đánh giá toàn bộ bố cục hoặc font có giống từng pixel.

## Browser QA mới

- Lần truy cập đầu tự mở bảng kỹ năng. Kỹ năng lấy từ tin đang hoạt động, không lấy từ draft/archive/expired.
- Python + SQL: Data Analyst 2/3 đứng trước Software Engineer 1/3. Reload và mở route Jobs giữ lựa chọn. Figma: chỉ Product Designer, nhãn `1 job` đúng.
- Không chọn kỹ năng: không đưa gợi ý giả; có Edit skills/View all jobs. All active jobs hiển thị cả 5 sample. Không có trạng thái Applied/Invites giả.
- Tìm `python` → 1; từ không khớp → 0; Back khôi phục query/kết quả; Clear all → 5. Sort Title A–Z hoạt động. Recommended dùng Best match. ArrowLeft trên tab chuyển đúng view và focus.
- 1440/768/390/320px: lưới 3/2/1 cột, documentWidth không vượt viewport. Bảng kỹ năng và trang chi tiết được kiểm tra ở màn hình nhỏ. Không kiểm tra điện thoại vật lý.
- Dark giữ qua reload; System bỏ override; Light phục hồi nền theo mẫu. Apply href/rel đúng source; detail có kỹ năng; expired có noindex và không CTA.
- Production preview có 0 tin, bảng kỹ năng rỗng giải thích rõ và nút View all jobs dùng được. Sample preview có nhãn riêng và noindex.
- Ảnh bằng chứng: `screenshots/redesign-desktop.png`, `redesign-skills-desktop.png`, `redesign-recommended.png`, `redesign-mobile.png`, `redesign-skills-mobile.png`, `redesign-detail-dark.png`.

## Sửa lỗi và giới hạn

Hai lượt owner test đầu gặp EPERM khi Astro đổi tên tệp cache tạm trên Windows. Log dev cho thấy bản sao QA làm Vite phát hiện config/tsconfig và khởi động lại. Đã thêm `vite.server.watch.ignored` cho qa/tmp và qa/build-logs; sau đó 13 lượt build đều đạt khi dev đang chạy. Không sửa dependencies, tắt kiểm tra nội dung hay thay đổi bảo vệ hệ thống.

JavaScript bị tắt, storage bị chặn và đổi theme OS giữa phiên được rà source, chưa browser-test riêng. Không có Lighthouse/axe audit. Tin mẫu không xác nhận tuyển dụng thực tế. Các giới hạn static snapshot, dependency audit và GitHub deployment trong báo cáo ban đầu bên dưới vẫn áp dụng; chưa chạy Actions/deploy thật.

---

# Báo cáo triển khai ban đầu — snapshot lịch sử trước thiết kế lại

Đã tạo website Astro tĩnh và xác nhận production build. Chưa deploy lên GitHub Pages; chưa có remote hoặc tin tuyển dụng thật.

## Build và content

- `final-check.log`: 37 files, 0 errors/warnings/hints.
- `final-tests.log`: 7/7 nhóm test schema, ngày, URL, Markdown, sample policy, template và duplicate URL.
- `final-build.log`: production exit 0, 5 trang HTML. Astro cảnh báo collection jobs rỗng theo chủ ý; không chèn tin giả để bỏ cảnh báo.
- `owner-workflow.json` và `build-logs/`: 13 tình huống build cách ly. Thêm tin, thay applyUrl, draft, khôi phục, explicit expired, hạn quá khứ/đúng hôm nay, archive, xóa, sample exclusion đều đạt. Metadata lỗi và sample flag production trả exit 1 như mong đợi.
- Mỗi thao tác owner chỉ thay Markdown; hash source ngoài content giữ nguyên trong chuỗi test. Bản sao tại `qa/tmp/` được Git ignore, không thuộc artifact deploy.
- Hidden không có detail/card/search/sitemap. Expired có nhãn/noindex, không CTA, không nằm trong active listing/search/sitemap.
- `routes.json`: 27 route/asset checks đạt trên root và /ten-repo/, gồm home/jobs/detail/about/disclaimer/404/search/robots/sitemap/CSS/JS/favicon.

## Browser QA

Thực hiện bằng Codex in-app browser trên dev sample và artifact production cách ly. Nội dung kiểm thử luôn có nhãn SAMPLE DEVELOPMENT DATA, chỉ dùng local.

- `KY SU DA NANG` khớp Kỹ sư dữ liệu tại Đà Nẵng: 1 kết quả.
- `giao tiep` khớp body Markdown: 2 kết quả.
- Category Dữ liệu + Đà Nẵng + Công ty Một + hôm nay: 1; thêm Hybrid không tương thích: 0.
- Back/forward khôi phục 1/0; reset trả 2. Query giữ qua reload.
- Sort cũ nhất đưa ngày 02/10 trước 03/10; thứ tự giữ sau reload.
- Tab từ search đến category với outline rõ; Enter submit hoạt động.
- Detail hiển thị heading/list/bold/link; apply href đúng content, có noopener noreferrer và hostname nguồn.
- Expired hiển thị cảnh báo, giữ nguồn và bỏ CTA.
- Dark mode giữ sau reload: data-theme dark, background rgb(16,33,31). Light kiểm tra trực quan; System bỏ override, dùng CSS hệ thống hiện tại.
- Danh sách/detail ở 320×800, 360×800, 390×844, 768×1024, 1440×900: scrollWidth không vượt viewport. Ảnh tại `screenshots/`.
- Production thực root có 0 tin, trạng thái trống và search JSON rỗng. Sample preview là chế độ riêng.

Chưa thử điện thoại vật lý, JavaScript tắt, thay theme OS giữa phiên, storage bị chặn hoặc audit a11y tự động. HTML/noscript, try/catch storage và CSS prefers-color-scheme đã rà source; không coi source review là browser test. Link mẫu kiểm tra href/đích/rel, không xác nhận tin tuyển dụng bên thứ ba hoạt động.

## Các lỗi đã sửa

- Closing frontmatter fixture thiếu newline.
- URL dạng https:example.com thiếu // được chấp nhận trước đó; nay từ chối.
- Initials công ty một từ gọi join trên string.
- TypeScript nullable closures và kiểu diagnostic trong tests.
- Workflow cần pages:read; PR không phụ thuộc Pages đã cấu hình và không deploy.
- Bản sao QA chia sẻ node_modules từng gây đụng content cache khi root build đồng thời. Đã tách Astro/Vite cache vào .astro theo từng project. Chạy lại đồng thời final root check/build và toàn bộ owner workflow: cả hai đạt.

## Dependency và triển khai

`dependency-audit.json` ghi 2 mục high cùng advisory http-cache-semantics qua Astro: https://github.com/advisories/GHSA-ch52-4w7c-c8xp . Agent A xác minh chưa có bản vá tương thích tại thời điểm triển khai. Không force downgrade Astro 2.x. Deploy chỉ chứa file tĩnh, không backend/cache phản hồi theo tài khoản; cảnh báo vẫn được ghi nhận.

Workflow Pages pin action commit, cài lockfile, validate/check/test/build rồi upload/deploy. Chưa chạy Actions thật vì chưa có GitHub remote. URL local dùng localhost; deploy lấy origin/base từ Pages hoặc repository variables. Không scraping/import/cron/AI publishing.

## Chạy lại

```powershell
npm run check
npm test
npm run test:owner
npm run build
```

`tests/e2e/preview-routes.mjs` kiểm tra hai preview ở 4325 (root) và 4323 (/ten-repo/, artifact fixture); phải khởi động đúng server trước. Owner không cần chạy smoke test này mỗi lần đăng job.

Sandbox Windows từng làm tsx lỗi os.userInfo/ENOMEM. Các test/build đạt chạy qua quyền thực thi được công cụ duyệt; không sửa logic website để né lỗi host. Không có yêu cầu owner phải dùng terminal quản trị thường ngày.
