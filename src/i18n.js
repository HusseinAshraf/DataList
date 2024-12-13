import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // استخدام i18next-http-backend لتحميل ملفات الترجمة ديناميكيًا
  .use(initReactI18next) // دمج i18next مع React
  .init({
    lng: "de", // اللغة الافتراضية
    fallbackLng: "en", // اللغة الاحتياطية إذا لم تكن الترجمة متوفرة
    backend: {
      loadPath: "/locales/{{lng}}.json", // مسار تحميل ملفات الترجمة
    },
    interpolation: {
      escapeValue: false, // تعطيل الهروب لأن React يتعامل مع هذا تلقائيًا
    },
    react: {
      useSuspense: false, // تعطيل Suspense في حالة عدم الحاجة
    },
  });

export default i18n;
