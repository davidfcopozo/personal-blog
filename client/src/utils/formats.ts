import { UserType } from "@/typings/types";

export function getRelativeTime(
  date: Date | number,
  language: "en" | "es" = "en"
): string {
  const now = new Date();
  const past = date instanceof Date ? date : new Date(date);
  const diffInSeconds = (now.getTime() - past.getTime()) / 1000;

  let unit: "seconds" | "minutes" | "hours" | "days" | "months" | "years" =
    "seconds";
  let diff = diffInSeconds;

  if (diff >= 60) {
    diff /= 60; // minutes
    unit = "minutes";
  }
  if (diff >= 60) {
    diff /= 60; // hours
    unit = "hours";
  }
  if (diff >= 24) {
    diff /= 24; // days
    unit = "days";
  }
  if (diff >= 30) {
    diff /= 30; // months
    unit = "months";
  }
  if (diff >= 12) {
    diff /= 12; // years
    unit = "years";
  }

  const diffRounded = Math.floor(diff);
  switch (language) {
    case "en":
      if (unit === "seconds") return "just now";
      if (unit === "minutes")
        return `${diffRounded} minute${diffRounded > 1 ? "s" : ""} ago`;
      if (unit === "hours")
        return `${diffRounded} hour${diffRounded > 1 ? "s" : ""} ago`;
      if (unit === "days")
        return `${diffRounded} day${diffRounded > 1 ? "s" : ""} ago`;
      if (unit === "months")
        return `${diffRounded} month${diffRounded > 1 ? "s" : ""} ago`;
      if (unit === "years")
        return `${diffRounded} year${diffRounded > 1 ? "s" : ""} ago`;
      break;
    case "es":
      if (unit === "seconds") return "justo ahora";
      if (unit === "minutes")
        return `hace ${diffRounded} minuto${diffRounded > 1 ? "s" : ""}`;
      if (unit === "hours")
        return `hace ${diffRounded} hora${diffRounded > 1 ? "s" : ""}`;
      if (unit === "days")
        return `hace ${diffRounded} día${diffRounded > 1 ? "s" : ""}`;
      if (unit === "months")
        return `hace ${diffRounded} mes${diffRounded > 1 ? "es" : ""}`;
      if (unit === "years")
        return `hace ${diffRounded} año${diffRounded > 1 ? "s" : ""}`;
      break;
  }
  return "";
}

export function calculateReadingTime(text: string, locale: "en" | "es" = "en") {
  const wordsPerMinute = 200;

  const cleanedContent = cleanBlogContent(text);

  const wordCount = cleanedContent.trim().split(/\s+/).length;

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
      return `1 minute read`;
    } else {
      return `${readingTimeMinutes} minute read`;
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
