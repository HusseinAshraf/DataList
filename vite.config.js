import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip", // أو يمكنك استخدام 'brotli' بدلاً من 'gzip'
      threshold: 10240, // ضغط الملفات التي يزيد حجمها عن 10KB
      deleteOriginalAssets: false, // احتفظ بالملفات الأصلية
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // إعدادات إضافية للاختبار (اختياري)
  },
  build: {
    minify: "esbuild", // تصغير الكود لتحسين الأداء
  },
});
