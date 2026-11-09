# وب‌سایت شخصی سجاد

قالب فارسی و راست‌چین برای معرفی برنامه‌نویس با تمرکز بر هوش مصنوعی، ساخته‌شده با Next.js و React.

## گفت‌وگوی خصوصی با سجاد

دکمهٔ «صحبت با من» در گوشهٔ سایت، ثبت‌نام و ورود ایمیل/رمز عبور با Supabase Auth و گفت‌وگوی خصوصی با بک‌اند NestJS را فراهم می‌کند. مدیر با ایمیل تنظیم‌شده در `CHAT_ADMIN_EMAIL` وارد صندوق مدیریت می‌شود. پیام‌ها فقط از طریق بک‌اند و پس از اعتبارسنجی نشست Supabase ذخیره و خوانده می‌شوند.

### راه‌اندازی محلی

1. وابستگی‌های فرانت‌اند و بک‌اند را نصب کن:

   ```bash
   pnpm install
   pnpm install --dir backend
   ```

2. فایل `.env.example` را به `.env.local` کپی کن. URL و کلید Publishable پروژه در تنظیمات محلی این پروژه قرار گرفته‌اند؛ کلید Publishable عمومی است و می‌تواند در فرانت‌اند باشد.
3. فایل `backend/.env.example` را به `backend/.env` کپی کن و `SUPABASE_URL`، `SUPABASE_SECRET_KEY` و `CHAT_ADMIN_EMAIL` را تنظیم کن. Secret key فقط در بک‌اند قرار می‌گیرد؛ آن را در فرانت‌اند، GitHub یا چت قرار نده.
4. یک بار migration مربوط به چت را در Supabase Dashboard → SQL Editor اجرا کن:
   `supabase/migrations/20261110000100_create_private_chat.sql`
5. در Supabase → Authentication → URL Configuration، آدرس‌های محلی و صفحهٔ GitHub Pages را به Redirect URLs اضافه کن:
   `http://localhost:3000/**`، `http://localhost:3001/**` و `https://sajjadsalimk.github.io/persian-ai-portfolio/**`.
6. بک‌اند و فرانت‌اند را در دو ترمینال اجرا کن:

   ```bash
   pnpm api:dev
   pnpm dev
   ```

برای ثبت‌نام، کاربر ایمیلش را تأیید می‌کند اگر تأیید ایمیل در Supabase فعال باشد. آدرس callback از صفحه‌ای که کاربر در آن ثبت‌نام کرده گرفته می‌شود.

### انتشار

GitHub Pages فقط فرانت‌اند استاتیک را میزبانی می‌کند و NestJS را اجرا نمی‌کند. فایل `render.yaml` برای میزبانی API در Render آماده شده است. پس از ساخت سرویس از روی Blueprint، متغیرهای `SUPABASE_SECRET_KEY` و `CHAT_ADMIN_EMAIL` را در Render تنظیم کن. مقدار `NEXT_PUBLIC_API_URL` را در GitHub → Settings → Secrets and variables → Actions → Variables به شکل `https://<آدرس-سرویس>/api/v1` اضافه کن تا در build بعدی به فرانت‌اند برسد. آدرس‌هایی که در Supabase Auth → URL Configuration مجاز می‌کنی باید شامل دامنهٔ سایت منتشرشده باشند.

تا وقتی API روی یک میزبان عمومی اجرا و متغیر GitHub تنظیم نشده باشد، ورود و ثبت‌نام فعال می‌شوند اما ارسال و دریافت پیام از صفحهٔ منتشرشده ممکن نیست.

## اجرا در محیط توسعه

```bash
pnpm install
pnpm dev
```

سپس `http://localhost:3000` را باز کنید.

## بک‌اند NestJS و پیام‌های تماس

بک‌اند در پوشهٔ `backend` و مستقل از فرانت‌اند قرار دارد. در ترمینال دوم اجرا کنید:

```bash
pnpm install --dir backend
pnpm api:dev
```

API به‌صورت پیش‌فرض روی `http://localhost:4000` اجرا می‌شود. آدرس بررسی وضعیت:
`GET http://localhost:4000/api/v1/health`

مسیر دریافت پیام تماس:
`POST http://localhost:4000/api/v1/contacts`

درخواست تماس باید شامل `name`، `email`، `subject` و `message` باشد. پیام‌ها در جدول `public.contact_messages` ذخیره می‌شوند. اسکریپت ساخت جدول و دسترسی‌های امن در `supabase/migrations` قرار دارد.

فرم تماس فعلی به `contact_messages` می‌نویسد. برای راه‌اندازی اولیهٔ Supabase:

1. فایل `supabase/migrations/20261109000100_create_contact_messages.sql` را در SQL Editor داشبورد اجرا کن.
2. کلید secret فقط در بک‌اند بماند و وارد فرانت‌اند یا Git نشود.
3. بک‌اند را با `pnpm api:dev` اجرا کن.

جدول Row Level Security دارد و دسترسی Data API برای `anon` و `authenticated` بسته شده؛ درج پیام از مسیر بک‌اند با کلید محرمانه انجام می‌شود. پیام‌ها ذخیره می‌شوند اما هنوز ایمیلی ارسال نمی‌شود. برای تغییر پورت یا دامنه‌های مجاز CORS، `backend/.env` را تنظیم کن.

برای build بک‌اند:

```bash
pnpm api:build
```

## ساخت نسخهٔ نهایی

```bash
pnpm build
pnpm start
```

اطلاعات معرفی، پروژه‌ها و راه‌های ارتباطی در `app/page.tsx` نمونه هستند و باید با اطلاعات واقعی جایگزین شوند.
