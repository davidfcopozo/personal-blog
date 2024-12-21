import { UserType } from "@/typings/types";

export function getRelativeTime(
  date: Date | number,
  language: "en" | "es" = "en"
): string {
  const now = new Date();
  const past = date instanceof Date ? date : new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let unit: "seconds" | "minutes" | "hours" | "days" | "months" | "years" =
    "seconds";
  let diff = diffInSeconds;

  if (diffInSeconds < 60) {
    unit = "seconds";
  } else if (diffInSeconds < 3600) {
    diff = Math.floor(diffInSeconds / 60);
    unit = "minutes";
  } else if (diffInSeconds < 86400) {
    diff = Math.floor(diffInSeconds / 3600);
    unit = "hours";
  } else if (diffInSeconds < 2592000) {
    diff = Math.floor(diffInSeconds / 86400);
    unit = "days";
  } else if (diffInSeconds < 31536000) {
    diff = Math.floor(diffInSeconds / 2592000);
    unit = "months";
  } else {
    diff = Math.floor(diffInSeconds / 31536000);
    unit = "years";
  }

  const diffRounded = Math.floor(diff);

  const translations = {
    en: {
      seconds: "just now",
      minutes: `${diffRounded} minute${diffRounded > 1 ? "s" : ""} ago`,
      hours: `${diffRounded} hour${diffRounded > 1 ? "s" : ""} ago`,
      days: `${diffRounded} day${diffRounded > 1 ? "s" : ""} ago`,
      months: `${diffRounded} month${diffRounded > 1 ? "s" : ""} ago`,
      years: `${diffRounded} year${diffRounded > 1 ? "s" : ""} ago`,
    },
    es: {
      seconds: "justo ahora",
      minutes: `hace ${diffRounded} minuto${diffRounded > 1 ? "s" : ""}`,
      hours: `hace ${diffRounded} hora${diffRounded > 1 ? "s" : ""}`,
      days: `hace ${diffRounded} día${diffRounded > 1 ? "s" : ""}`,
      months: `hace ${diffRounded} mes${diffRounded > 1 ? "es" : ""}`,
      years: `hace ${diffRounded} año${diffRounded > 1 ? "s" : ""}`,
    },
  };

  return translations[language][unit];
}

export function calculateReadingTime(text: string, locale: "en" | "es" = "en") {
  const wordsPerMinute = 200;

  const cleanedContent = cleanBlogContent(text);

  const wordCount = cleanedContent?.trim()?.split(/\s+/).length;

  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  if (locale.toLowerCase() === "es") {
    if (readingTimeMinutes === 1) {
      return `1 minuto de lectura`;
    } else {
      return `${readingTimeMinutes} minutos de lectura`;
    }
  } else {
    // English output (default)
    if (readingTimeMinutes === 1) {
      return `1 min read`;
    } else {
      return `${readingTimeMinutes} min read`;
    }
  }
}

type TruncateText = (text: string, maxLength: number) => string;

export const truncateText: TruncateText = (text, maxLength) => {
  if (text && text.length <= maxLength) {
    return text;
  }

  let truncated = text?.substring(0, maxLength);

  const lastSpace = truncated?.lastIndexOf(" ");

  if (lastSpace > 0) {
    truncated = truncated?.substring(0, lastSpace);
  }

  return truncated + "...";
};

export function showMonthDay(
  isoDate: string,
  locale: "en" | "es" = "en"
): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };

  try {
    return date.toLocaleDateString(locale, options);
  } catch (e) {
    // If the locale is not supported, fall back to English
    return date.toLocaleDateString("en", options);
  }
}
export function showMonthDayYear(
  isoDate: string,
  locale: "en" | "es" = "en"
): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  try {
    return date.toLocaleDateString(locale, options);
  } catch (e) {
    // If the locale is not supported, fall back to English
    return date.toLocaleDateString("en", options);
  }
}

export function getNameInitials(user: UserType): string {
  if (!user || typeof user !== "object" || !user.firstName || !user.lastName) {
    return "TC";
  }
  const firstInitial = user?.firstName.charAt(0).toUpperCase();

  const lastInitial = user?.lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function getFullName(user: UserType) {
  if (!user) {
    return "";
  }

  const capitalize = (str: string) => {
    if (typeof str !== "string" || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const firstName = user?.firstName
    ? capitalize(user?.firstName as string)
    : "";
  const lastName = user?.lastName ? capitalize(user?.lastName as string) : "";

  return firstName && lastName
    ? `${firstName} ${lastName}`
    : firstName + lastName;
}

export const extractFirstParagraphText = (
  htmlContent: string
): string | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const firstParagraph = doc.querySelector("p");

  return firstParagraph ? firstParagraph.textContent || "" : null;
};

export const convertSlugToName = (cat: string) => {
  return cat
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const cleanBlogContent = (content: string) => {
  const textOnly = content?.replace(/<[^>]*>/g, "");

  const noImages = textOnly?.replace(/<img[^>]*>/g, "");

  return noImages?.trim();
};

export function arraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}
