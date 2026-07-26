# گزارش بررسی (وضعیت فعلی)

بررسی روی apispec زندهٔ Xano (`apispec:grade-supervisor` و `apispec:student-api`) و کد فعلی فرانت انجام شد.

**۱. گروه grade-supervisor چه چیزی برای آزمون برمی‌گرداند؟**
هیچ endpoint اختصاصی آزمون در این گروه وجود ندارد. لیست کامل مسیرها:
`/students`, `/students/{student_id}`, `/students/import`, `/students/{student_id}/mentoring-history`, `/classes`, `/classes/create`, `/reports/*`, `/study_logs`, `/mentoring_sessions`, `/calendar*`, `/appointments`, `/availability/create`, `/pulse/analyze`, `/pulse/upload`, `/chapter1/monitoring`.
تنها منبع دادهٔ آزمون، فیلد `exam_summary` داخل `GET /students/{student_id}` است که طبق قرارداد فعلی فرانت فقط شامل `exam_count`, `average_percentage`, `latest_exams[]` است. **هیچ breakdown بر اساس درس یا سرفصل ندارد.** (اسکیمای پاسخ در apispec به‌صورت `object {}` تعریف شده، یعنی خودِ Xano هم شکل خروجی را اعلام نکرده — تأیید دقیق فیلدها نیاز به یک فراخوانی با توکن واقعی مسئول پایه دارد.)

**۲. میانگین کلاس/پایه برای مقایسه؟**
در دسترس نیست. در هیچ‌کدام از دو گروه endpointی که میانگین گروهی/کلاسی آزمون بدهد وجود ندارد. `/study_logs` فقط تجمیع دقایق مطالعه است، نه نمره.

**۳. داده سطح سؤال یا درس‌به‌درس؟**
در سمت دانش‌آموز وجود دارد: `GET /exams/{exam_id}/analysis` و `GET /attempts/{attempt_id}/result` در گروه `student-api`. اما این‌ها student-scoped هستند و از نقش مسئول پایه قابل استفاده نیستند (بدون attempt_id و بدون مجوز). یعنی داده احتمالاً در دیتابیس هست ولی از مسیر supervisor بازیابی نمی‌شود. (فراخوانی ناشناس `/exams/1/analysis` مقدار `null` برگرداند.)

**۴. داده تاریخی کافی برای نمودار روند؟**
تأییدنشده. تنها `latest_exams` (چند مورد آخر) در دسترس است، نه یک تاریخچهٔ کامل با تاریخ برای هر دانش‌آموز. برای نمودار روند، endpoint تاریخچه لازم است.

**نتیجه:** ساخت «آنالیز دقیق هر دانش‌آموز» با APIهای فعلی ممکن نیست؛ نیاز به افزودن endpoint در Xano دارد.

---

# پلن

## بخش الف — افزوده‌های Xano (گروه grade-supervisor)

۱. `GET /grade-supervisor/students/{student_id}/exams`
پارامترها: `from_date`, `to_date`, `subject_id?`
خروجی: `{ exams: [{ exam_id, attempt_id, title, exam_type, exam_date, subject_id, subject_name, chapter_id, chapter_name, question_count, correct, wrong, unanswered, percentage, duration_seconds }], totals: {...} }`
← این یکی هم مسئلهٔ ۴ (روند زمانی) و هم پایهٔ تفکیک درسی را حل می‌کند.

۲. `GET /grade-supervisor/students/{student_id}/exam-breakdown`
خروجی: `by_subject[]` و `by_chapter[]` با `{ id, name, exam_count, avg_percentage, correct, wrong, unanswered, class_avg_percentage }` ← نقاط قوت/ضعف.

۳. `GET /grade-supervisor/exams/benchmarks`
پارامترها: `grade_level`, `major`, `class_name?`, `from_date?`, `to_date?`
خروجی: میانگین پایه/کلاس به‌صورت کلی، به تفکیک درس، و به تفکیک هر آزمون (`per_exam[{exam_id, class_avg, grade_avg, rank_of_student?}]`) ← مقایسه با میانگین گروه.

۴. (اختیاری، فاز دوم) `GET /grade-supervisor/attempts/{attempt_id}/analysis` — نسخهٔ supervisor-scoped از تحلیل سطح سؤال، با بررسی مجوز که دانش‌آموز در محدودهٔ مسئول پایه باشد.

۵. `GET /grade-supervisor/exams/overview` — رتبه‌بندی کل پایه (بهترین/ضعیف‌ترین درس‌ها، دانش‌آموزان نیازمند توجه) برای صفحهٔ فهرست.

همهٔ endpointها باید همان guard مالکیت پایه/رشته را داشته باشند و در نبود داده، آرایهٔ خالی برگردانند (نه null).

## بخش ب — فرانت‌اند

**لایهٔ داده**
- `src/lib/api/grade-supervisor-exams.ts`: تایپ‌ها + توابع `getStudentExamHistory`, `getStudentExamBreakdown`, `getGradeBenchmarks`, با نرمال‌سازی دفاعی (رشته‌های عددی Xano، آرایه‌های null) مطابق الگوی موجود در پروژه، و retry روی 429.

**کامپوننت‌های `src/components/analytics/`**
- گسترش `line-chart-card.tsx` (بدون شکستن مصرف‌کننده‌های فعلی): پشتیبانی از خط مرجع/خط دوم برای میانگین کلاس.
- `exam-trend-card.tsx` — نمودار روند درصد نمرات در طول زمان + خط میانگین پایه، تاریخ‌ها به شمسی.
- `subject-breakdown-card.tsx` — نوارهای افقی به‌ازای هر درس: درصد دانش‌آموز در برابر میانگین پایه، مرتب‌شده.
- `strength-weakness-card.tsx` — دو ستون «نقاط قوت» / «نیازمند توجه» بر اساس اختلاف با میانگین.
- `comparison-stat-tiles.tsx` — کاشی‌های میانگین کل، اختلاف با پایه، تعداد آزمون، دقت پاسخ‌گویی.
- `exam-history-table.tsx` — جدول آزمون‌ها با درصد، درست/غلط/نزده و تاریخ شمسی.

**صفحهٔ `src/routes/grade-supervisor.students.$id.tsx`**
- بخش «نتایج آزمون‌ها» فعلی به یک تب/بخش کامل «تحلیل آزمون‌ها» ارتقا می‌یابد و کامپوننت‌های بالا را به ترتیب: کاشی‌ها ← نمودار روند ← تفکیک درسی ← قوت/ضعف ← جدول تاریخچه رندر می‌کند.
- بارگذاری داده به‌صورت ترتیبی (نه موازی) برای کاهش فشار rate limit.
- حفظ کامل الگوهای فعلی: RTL، فونت وزیر، اعداد فارسی با `toFa`، حالت‌های loading/forbidden/error، و «حالت خالی» فارسی وقتی داده‌ای نیست.

**سازگاری تدریجی:** تا وقتی endpointهای جدید در Xano ساخته نشده‌اند، صفحه همان `exam_summary` فعلی را نشان می‌دهد و بخش‌های جدید حالت خالیِ «داده‌ای ثبت نشده» می‌گیرند — بدون کرش و بدون دادهٔ ساختگی.

## ترتیب اجرا
۱) ساخت endpointهای ۱–۳ در Xano ← ۲) لایهٔ داده و تایپ‌ها ← ۳) کامپوننت‌های تحلیلی ← ۴) اتصال در صفحهٔ دانش‌آموز ← ۵) (اختیاری) نمای پایه‌ای در فهرست دانش‌آموزان.

## نکات فنی
- بدون داده ساختگی؛ فقط Xano واقعی.
- تاریخ‌ها با همان مبدل شمسی موجود در پروژه.
- رنگ‌ها از توکن‌های design system (`var(--color-*)`) مانند `line-chart-card.tsx` فعلی.
- قبل از پیاده‌سازی، یک فراخوانی با توکن واقعی مسئول پایه روی `/students/{id}` انجام می‌شود تا شکل دقیق `exam_summary` تأیید و تایپ‌ها با آن هم‌راستا شوند.
