import React from "react";
import { LucideIcon } from "lucide-react";

interface EngagementButtonProps {
  icon: LucideIcon;
  count?: number;
  label: string;
  onClick?: () => void;
}

export function EngagementButton({
  icon: Icon,
  count,
  label,
  onClick,
}: EngagementButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 text-gray-600 hover:text-blue-600 transition-colors duration-200"
      aria-label={label}
    >
      <Icon className="w-6 h-6" />
      {count !== undefined && (
        <span className="text-sm font-medium">{count}</span>
      )}
    </button>
  );
}
