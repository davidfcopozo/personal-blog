"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

const SortIndicator = ({
  direction,
  size,
  strokeWidth,
  activeColor,
  isActive,
  title,
}: {
  direction: "asc" | "desc" | undefined;
  size?: number;
  strokeWidth?: number;
  activeColor?: string;
  isActive: boolean;
  title: string;
}) => {
  return (
    <div className="flex items-center">
      <p>{title}</p>
      <span className="flex flex-col ml-1 justify-center items-center">
        <ChevronUp
          size={size}
          strokeWidth={strokeWidth}
          className={`${
            isActive &&
            direction === "asc" &&
            `stroke-[${activeColor ? activeColor : "--thread-border"}]`
          }`}
          aria-label="Sort ascending arrow"
        />

        <ChevronDown
          size={size}
          strokeWidth={strokeWidth}
          className={`${
            isActive &&
            direction === "desc" &&
            `stroke-[${activeColor ? activeColor : "--thread-border"}]`
          }`}
          aria-label="Sort descending arrow"
        />
      </span>
    </div>
  );
};

export default SortIndicator;
