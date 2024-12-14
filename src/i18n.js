import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

// تحقق من بيئة التشغيل لإعدادات خاصة بالاختبار
const isTestEnv = process.env.NODE_ENV === "test";

if (isTestEnv) {
  i18n.use(initReactI18next).init({
    lng: "en", // اللغة الافتراضية للاختبارات
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          loadingDetails: "Loading details...",
          detailsNotFound: "Details not found.",
          errorFetchingData: "Error fetching data",
          networkError: "Network Error",
          unexpectedError: "Unexpected Error",
          symbol: "Symbol",
          type: "Type",
          country: "Country",
          currency: "Currency",
          description: "Description",
          notAvailable: "Not available",
          viewCandle: "View Candle",
          back: "Back",
          details: "Details",
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
} else {
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
}

export default i18n;
