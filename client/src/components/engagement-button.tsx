import React, { MouseEvent } from "react";
import { LucideIcon } from "lucide-react";

interface EngagementButtonProps {
  icon: LucideIcon;
  count?: number;
  label: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  extraClasses?: string;
  iconStyles?: string;
}

export function EngagementButton({
  icon: Icon,
  count,
  label,
  onClick,
  extraClasses,
  iconStyles,
}: EngagementButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 text-gray-300 transition-colors duration-200 ${
        extraClasses ? extraClasses : "hover:text-[#1d9bf0]"
      }`}
      aria-label={label}
    >
      <Icon className={`"w-6 h-6" ${iconStyles}`} />
      {count !== undefined && (
        <span className="text-sm font-medium">{count}</span>
      )}
    </button>
  );
}
