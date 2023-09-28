import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColorHex() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

export function hexToRgb(hex: string) {
  return (
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16)) ?? [0, 0, 0]
  );
}

export function getColorFromPriority(
  priority: "high" | "medium" | "low" | undefined
) {
  if (priority === "low") return "bg-yellow-500/50";
  else if (priority === "medium") return "bg-orange-500/50";
  else if (priority === "high") return "bg-red-500/50";
  return "bg-neutral-500/50";
}
