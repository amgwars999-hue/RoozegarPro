# 📤 پوش کردن پروژه به GitHub با CMD

## گام ۱: ساخت ریپو در GitHub (اول اینو برو سایت)
1. برو https://github.com/new
2. Repository name: `RoozegarPro`
3. Public یا Private فرقی نداره
4. دکمه سبز **Create repository** رو بزن

---

## گام ۲: ساخت Token (کلید دسترسی)
1. برو https://github.com/settings/tokens
2. دکمه **Generate new token (classic)**
3. Note: `RoozegarPro`
4. Expiration: **No expiration**
5. تیک ✅ `repo` رو بزن (کل بخش repo)
6. پایین صفحه **Generate token**
7. **کپی کن!** (یه رشته طولانی مثل `ghp_abc123...`)

---

## گام ۳: دستورات CMD

توی CMD اینا رو به ترتیب بزن:

```cmd
cd "E:\projects\New folder\RoozegarPro"
```

### اگر اولین باره (remote نداری):
```cmd
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git
git branch -M main
git push -u origin main
```

### اگر قبلاً زدی و خطا داد (remote اشتباهه):
```cmd
git remote remove origin
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git
git branch -M main
git push -u origin main
```

---

## گام ۴: وارد کردن یوزر و پسورد

وقتی `git push` رو زدی، سوال می‌کنه:

```
Username for 'https://github.com': 
```
بنویس: `amgwars999-hue` (یوزرنیم گیت‌هابت)

```
Password for 'https://amgwars999-hue@github.com': 
```
بنویس: `ghp_xxxxxxxxxxxxxxxxxxxx` (توکن کپی شده)

> ⚠️ **مهم:** وقتی پسورد می‌نویسی، هیچ چیزی نشون نمیده! ولی داره تایپ می‌شه. بعد Enter بزن.

---

## ✅ اگر همه چی درست باشه

```
Enumerating objects: 31, done.
Counting objects: 100% (31/31), done.
Delta compression using up to 8 threads
Compressing objects: 100% (31/31), done.
Writing objects: 100% (31/31), 45.23 KiB | 15.08 MiB/s, done.
Total 31 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/amgwars999-hue/RoozegarPro.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

این یعنی ✅ **موفق شد!**

---

## ❌ اگر خطا داد

### خطا: `repository not found`
یعنی ریپو توی GitHub ساخته نشده. برو گام ۱ رو انجام بده.

### خطا: `remote origin already exists`
بزن:
```cmd
git remote remove origin
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git
```

### خطا: `Authentication failed`
یعنی توکن اشتباهه. یه توکن جدید بساز (گام ۲).

---

## 🚀 بعد از پوش موفق

1. برو https://github.com/amgwars999-hue/RoozegarPro
2. باید همه فایل‌ها رو ببینی
3. تب **Actions** رو بزن
4. دکمه **Run workflow** → **Run workflow**
5. ۵-۱۰ دقیقه صبر کن
6. APK دانلود کن! 🎉
