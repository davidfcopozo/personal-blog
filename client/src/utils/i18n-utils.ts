import { type Locale } from "@/i18n/config";

export function createLocalizedPath(pathname: string, locale: Locale): string {
  // Remove any existing locale prefix
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  // Add the new locale prefix
  return `/${locale}${pathWithoutLocale}`;
}

export function getPathnameWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}/, "") || "/";
}

export function getLocaleFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})/);
  return match ? match[1] : null;
}
