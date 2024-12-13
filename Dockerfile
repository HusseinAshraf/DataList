
# Step 1: استخدام Node.js كبيئة بناء
FROM node:20.11.1 AS build

# تعيين مسار العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات البروجكت إلى الحاوية
COPY package*.json ./
RUN npm install

COPY . .

# بناء التطبيق
RUN npm run build

# Step 2: إعداد Nginx لخدمة الملفات الثابتة
FROM nginx:alpine

# نسخ ملفات البناء من الخطوة السابقة إلى Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# نسخ إعدادات Nginx (اختياري)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# تعريف المنفذ
EXPOSE 80

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]