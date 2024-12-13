import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      // تفعيل ضغط Gzip أو Brotli
      algorithm: "gzip", // يمكنك أيضًا استخدام 'brotli' بدلاً من 'gzip'
      threshold: 10240, // ضغط الملفات التي يتجاوز حجمها 10KB
      deleteOriginalAssets: false, // لا تحذف الملفات الأصلية بعد الضغط
    }),
  ],
  build: {
    // يمكن تمكين تصغير الكود هنا إذا لم يكن مفعلاً بشكل افتراضي
    minify: "esbuild", // تأكد من تصغير الكود في بيئة الإنتاج
  },
});
