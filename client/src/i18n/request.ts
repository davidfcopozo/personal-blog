import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid
  const validLocale =
    locale && locales.includes(locale as any) ? locale : defaultLocale;

  try {
    return {
      locale: validLocale,
      messages: (await import(`../messages/${validLocale}.json`)).default,
    };
  } catch (error) {
    console.error("Failed to load messages for locale:", validLocale, error);
    return {
      locale: validLocale,
      messages: {},
    };
  }
});
