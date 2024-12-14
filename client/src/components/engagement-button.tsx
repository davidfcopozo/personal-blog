import React from "react";
import { LucideIcon } from "lucide-react";

interface EngagementButtonProps {
  icon: LucideIcon;
  count?: number;
  label: string;
  onClick?: () => void;
  extraClasses?: string;
}

export function EngagementButton({
  icon: Icon,
  count,
  label,
  onClick,
  extraClasses,
}: EngagementButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 text-gray-300 transition-colors duration-200 ${
        extraClasses ? extraClasses : "hover:text-[#1d9bf0]"
      }`}
      aria-label={label}
    >
      <Icon className="w-6 h-6" />
      {count !== undefined && (
        <span className="text-sm font-medium">{count}</span>
      )}
    </button>
  );
}
