# 🔧 راهنمای فیکس پوش به GitHub

## مشکل ۱: remote با YOUR_USERNAME ساخته شده

### پاک کردن remote قدیمی و ساخت جدید:
```cmd
git remote remove origin
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git
```

> اگر یوزرنیم گیت‌هابت `amgwars999-hue` نیست، عوضش کن!

## مشکل ۲: GitHub دیگه پسورد قبول نمی‌کنه

GitHub از سال ۲۰۲۱ پسورد عادی رو بسته. باید **Token** بسازی.

### ساخت Token (گام به گام):

1. برو https://github.com/settings/tokens
2. دکمه **Generate new token (classic)** رو بزن
3. یه اسم بذار مثلاً `RoozegarPro`
4. Expiration: **No expiration** (یا ۹۰ روز)
5. تیک اینا رو بزن:
   - ✅ `repo` (دسترسی کامل به ریپو)
6. پایین صفحه **Generate token** رو بزن
7. **توکن رو کپی کن!** (فقط یه بار نشون میده)

مثال توکن:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## پوش کردن با Token

وقتی پسورد خواست، به جای پسورد گیت‌هاب، **توکن** رو paste کن:

```cmd
git push -u origin main
```

Username: `amgwars999-hue` (یا ایمیلت)
Password: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (توکن)

## ✅ خلاصه دستورات کامل

```cmd
cd "E:\projects\New folder\RoozegarPro"

REM پاک کردن remote اشتباه
git remote remove origin

REM ساخت remote درست (یوزرنیم واقعی)
git remote add origin https://github.com/amgwars999-hue/RoozegarPro.git

REM پوش
git push -u origin main
```

بعد Username و Password (token) رو وارد کن.

---

## ⚠️ نکته مهم

اگر باز هم ارور `repository not found` داد، یعنی ریپو توی GitHub ساخته نشده. برو:
https://github.com/new
و یه ریپو با اسم `RoozegarPro` بساز (Public یا Private).
