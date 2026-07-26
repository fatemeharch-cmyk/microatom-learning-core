## گزارش بررسی (وضعیت فعلی)

**۱. endpointهای آزمون در گروه grade-supervisor**
گروه `grade-supervisor` هیچ endpoint اختصاصی آزمون ندارد. تنها منبع، `GET /students/{student_id}` است که یک `exam_summary` ساده برمی‌گرداند: تعداد آزمون، `average_percentage` و چند آزمون اخیر (`latest_exams`) با عنوان/تاریخ/درصد. **breakdown درس‌به‌درس یا سرفصلی وجود ندارد.**

**۲. میانگین کلاس/پایه**
در دسترس نیست. هیچ endpoint بنچمارک یا aggregate در گروه مسئول پایه تعریف نشده، پس مقایسهٔ دانش‌آموز با گروه فعلاً قابل محاسبه نیست.

**۳. داده سطح سؤال یا سرفصل**
در گروه `content`/`student` سؤالات دارای `subject`/`chapter` هستند و پاسخ‌های آزمون ثبت می‌شوند، اما در خروجی مسئول پایه هیچ‌کدام expose نشده‌اند. یعنی داده احتمالاً در DB هست ولی API آن را برنمی‌گرداند.

**۴. داده تاریخی برای نمودار روند**
فقط چند آزمون اخیر (نه تاریخچهٔ کامل) برمی‌گردد؛ برای نمودار روند معنادار ناکافی است.

## وضعیت فرانت‌اند (ساخته‌شده)

لایهٔ داده و کامپوننت‌های تحلیل قبلاً اضافه شده‌اند و در پروفایل دانش‌آموز رندر می‌شوند:
`src/lib/api/grade-supervisor-exams.ts` + `src/components/analytics/` شامل `student-exam-analytics`، `exam-trend-card`، `subject-breakdown-card`، `strength-weakness-card`، `comparison-stat-tiles`، `exam-history-table`، `line-chart-card`.
این‌ها امروز به‌صورت graceful به همان `exam_summary` برمی‌گردند و به‌محض آماده‌شدن endpointهای جدید، بدون تغییر کد داده‌های کامل را نشان می‌دهند.

## کاری که در Xano لازم است (بلوکه‌کنندهٔ اصلی)

در گروه `grade-supervisor` سه endpoint اضافه شود:

```text
GET /students/{student_id}/exams
  -> [{ exam_id, attempt_id, title, exam_type, exam_date,
        subject_id, subject_name, chapter_id, chapter_name,
        question_count, correct, wrong, unanswered,
        percentage, duration_seconds }]
     (تاریخچهٔ کامل، مرتب بر اساس تاریخ)

GET /students/{student_id}/exam-breakdown
  -> { by_subject: [{ id, name, exam_count, avg_percentage,
                      correct, wrong, unanswered, class_avg_percentage }],
       by_chapter: [ ... همان ساختار ... ] }

GET /exams/benchmarks?class_id=&grade=
  -> { grade_avg_percentage, class_avg_percentage,
       by_subject: [{ id, name, avg_percentage }],
       per_exam: { <exam_id>: avg_percentage } }
```

نکته‌ها: همهٔ درصدها عددی (نه رشته)، تاریخ‌ها ISO، و دسترسی محدود به مسئول پایهٔ همان پایه/کلاس.

## پس از آماده‌شدن endpointها (کار فرانت‌اند)

1. حذف مسیر fallback در `grade-supervisor-exams.ts` و اتکا به دادهٔ کامل.
2. فعال‌کردن خط «میانگین پایه/کلاس» روی نمودار روند و کاشی‌های مقایسه‌ای.
3. تکمیل کارت نقاط قوت/ضعف بر اساس اختلاف درصد دانش‌آموز با میانگین گروه در هر درس/سرفصل.
4. افزودن فیلتر بازهٔ زمانی و نوع آزمون در جدول تاریخچه.
5. تست با یک دانش‌آموز واقعی و بررسی حالت‌های خالی/خطا.

اگر تأیید کنی، می‌توانم موازی با ساخت endpointها در Xano، قرارداد دقیق JSON را به‌صورت مستند در کد ثابت کنم تا اتصال بدون بازنویسی انجام شود.
