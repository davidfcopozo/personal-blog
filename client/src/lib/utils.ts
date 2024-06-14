import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  const wordCount = text.trim().split(/\s+/).length;

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
  if (text.length <= maxLength) {
    return text;
  }

  let truncated = text.substr(0, maxLength);

  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    truncated = truncated.substr(0, lastSpace);
  }

  return truncated + "...";
};

