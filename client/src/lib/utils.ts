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
  console.log(`Language: ${language}, Unit: ${unit}`);
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
      console.log(`Language: ${language}, Unit: ${unit}`);
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
