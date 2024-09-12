import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const isAM = hour < 12;
  const hour12 = String(hour % 12 || 12);
  const period = isAM ? "AM" : "PM";

  return `${year}-${month}-${day} ${hour12}:${minute} ${period}`;
}

export function CleanType(writerType) {
  return writerType.replace("Writer", "");
};

export function formatNumbers(number) {
  if (number < 1000) return number;

  const divisor = number >= 1000000 ? 1000000 : 1000;
  const formattedNumber = (number / divisor).toFixed(1);

  return `${formattedNumber}${divisor === 1000 ? 'k' : 'M'}`;
}


export function StoriesformatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const cleanContent = (content) => {
  return content
    .trim() // Removes leading and trailing spaces
    .replace(/\n+/g, ' ') // Replaces multiple newlines with a single space
    .replace(/\n\s*\n+/g, '\n'); // Replaces multiple newlines with a single newline
};

export const cleanDescription = (content) => {
  return content
    .trim() // Removes leading and trailing spaces
    .replace(/\n\s*\n+/g, '\n'); // Replaces multiple newlines with a single newline
};