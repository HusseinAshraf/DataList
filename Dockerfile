# Step 1: استخدام Node.js كبيئة بناء
FROM node:20.11.1 AS build

# تعيين مسار العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات البروجكت التي تحتوي على التبعيات إلى الحاوية
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ باقي الملفات إلى الحاوية
COPY . .

# بناء التطبيق
RUN npm run build

# Step 2: إعداد Nginx لخدمة الملفات الثابتة
FROM nginx:alpine

# نسخ ملفات البناء من الخطوة السابقة إلى Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# نسخ إعدادات Nginx (اختياري)
# تأكد من أن ملف nginx.conf موجود في نفس المجلد الذي يحتوي على Dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf

# تعريف المنفذ
EXPOSE 80

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]
