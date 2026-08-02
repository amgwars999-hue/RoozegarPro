# 📱 گرفتن APK با GitHub Actions

## مزایا
- ✅ نیازی به Android Studio نداری
- ✅ نیازی به اکانت Expo نداری
- ✅ روی سرور GitHub ساخته می‌شه (رایگان)
- ✅ هر بار پوش کنی، APK جدید می‌سازه

---

## 🚀 مراحل (گام به گام)

### ۱. ساخت ریپو در GitHub
1. برو https://github.com/new
2. اسم ریپو: `RoozegarPro`
3. Public یا Private فرقی نداره
4. **Create repository**

### ۲. پوش کردن کد به GitHub
توی CMD توی پوشه پروژه:

```cmd
cd "E:\projects\New folder\RoozegarPro"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/RoozegarPro.git
git push -u origin main
```

> به جای `YOUR_USERNAME` یوزرنیم گیت‌هاب خودت رو بذار.

### ۳. استارت build
1. برو به صفحه ریپو در GitHub
2. تب **Actions** رو بزن
3. workflow "Build Android APK" رو پیدا کن
4. دکمه **Run workflow** → **Run workflow** رو بزن

یا خودکار با هر `git push` اجرا می‌شه.

### ۴. دانلود APK
1. توی تب Actions، روی آخرین run کلیک کن
2. صبر کن تا ✅ سبز بشه (حدود ۵-۱۰ دقیقه)
3. پایین صفحه قسمت **Artifacts** رو ببین
4. روی `roozegar-pro-apk` کلیک کن تا دانلود بشه

### ۵. نصب روی گوشی
1. فایل ZIP دانلودی رو اکسترکت کن
2. فایل `app-release-unsigned.apk` رو به گوشی منتقل کن
3. روی گوشی: **Settings → Security → Unknown Sources** رو فعال کن
4. APK رو نصب کن

---

## ⚠️ نکات

- اولین build ممکنه ۱۰ دقیقه طول بکشه (دانلود SDK)
- اگر release خطا داد، debug APK هم به صورت خودکار آپلود می‌شه
- برای داشتن APK امضا‌شده (Signed) باید keystore اضافه کنی (برای انتشار در بازار)

---

## 🔧 عیب‌یابی

اگر build fail شد:
1. توی GitHub → Actions → روی run قرمز کلیک کن
2. لاگ رو بخون ببین کدوم step خطا داد
3. معمولاً مشکل از:
   - `npm install` fail → package.json خراب
   - `gradlew` fail → نیاز به `chmod +x`
   - Prebuild fail → expo نصب نشده
