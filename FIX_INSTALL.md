# 🔧 راهنمای رفع مشکل نصب (ویندوز)

## مشکل اصلی
مسیر پوشه فارسی + نسخه‌های ناسازگار پکیج‌ها باعث fail شدن `npm install` شده.

## ✅ مراحل حل

### ۱. منتقل کردن به مسیر انگلیسی
پوشه `RoozegarPro` رو کپی کن توی یه مسیر ساده انگلیسی، مثلاً:
```
E:\Projects\RoozegarPro
```
**مهم:** از مسیر فارسی استفاده نکن!

### ۲. پاک کردن cache و پوشه‌های قدیمی
داخل پوشه پروژه (با CMD یا PowerShell) اینا رو بزن:

```cmd
rmdir /s /q node_modules
rmdir /s /q package-lock.json
npm cache clean --force
```

### ۳. نصب دوباره
```cmd
npm install
```

اگر باز خطا داد، این رو امتحان کن:
```cmd
npm install --legacy-peer-deps
```

### ۴. اجرای Expo
```cmd
npx expo start
```

اگر expo نصب نشده بود:
```cmd
npm install -g expo-cli
npx expo start
```

---

## ⚠️ نکات ویندوز

1. **Node.js** باید نسخه ۱۸ یا ۲۰ باشه. چک کن:
   ```cmd
   node -v
   ```

2. **Python** باید نصب باشه (برای بعضی ماژول‌های native):
   ```cmd
   python --version
   ```

3. اگر `react-native-screens` باز هم خطا داد، می‌تونی از Expo Go استفاده کنی و نیازی به `prebuild` نباشه:
   ```cmd
   npx expo start
   ```
   بعد با **Expo Go** روی گوشی یا شبیه‌ساز بازش کن.

---

## 🚀 اجرا بدون prebuild (سریع‌تر)
برای تست و توسعه اولیه، نیازی به `npx expo prebuild` نیست. کافیه:

```cmd
npx expo start
```

بعد:
- `i` برای iOS Simulator
- `a` برای Android Emulator
- QR Code رو با Expo Go روی گوشی واقعی اسکن کن
