import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRouteActivePath(currentPath: string, targetPath: string) {
  if (targetPath === "/") {
    return currentPath === "/" || currentPath.includes("chats");
  }

  return currentPath === targetPath || currentPath.includes(targetPath);
}

export const getFormatedTimestamp = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);

  if (differenceInHours(now, date) < 24) {
    return format(date, "HH:mm");
  } else if (differenceInDays(now, date) < 7) {
    return format(date, "EEE");
  } else if (differenceInWeeks(now, date) < 4) {
    return format(date, "'Week' w");
  } else {
    return format(date, "MMM");
  }
};

export const getFormattedToPluralize = (item: string, length: number) =>
  length <= 1 ? item : `${item}s`;

export const linkFromStorage = (content: string) => {
  if (content.startsWith("https://") || content.startsWith("http://")) {
    const strToArray = content.split("/");
    return strToArray[strToArray.length - 1];
  }
};
