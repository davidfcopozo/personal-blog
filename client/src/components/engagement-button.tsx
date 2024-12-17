import { EngagementButtonProps } from "@/typings/interfaces";
import React from "react";

export function EngagementButton({
  icon: Icon,
  count,
  label,
  onClick,
  extraClasses,
  iconStyles,
  activeColor = "#1d9bf0",
  isActivated = false,
  horizontalCount = false,
}: EngagementButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative 
        flex 
        ${horizontalCount ? "flex-row items-center gap-2" : "flex-col"}
        justify-center 
        p-3 
        text-gray-300 
        transition-colors 
        duration-200 
        ${extraClasses && extraClasses}
      `}
      aria-label={label}
    >
      <div className="relative">
        <Icon
          className={`w-6 h-6 transition-colors duration-300 ${
            isActivated ? "stroke-gray-400" : "stroke-gray-400"
          } ${iconStyles}`}
        />
        <Icon
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isActivated
              ? `${activeColor} scale-100 opacity-100`
              : "scale-0 opacity-0"
          } ${iconStyles}`}
        />
      </div>

      {count !== undefined && (
        <div
          className={`
            relative 
            ${
              horizontalCount
                ? "w-[50px] flex items-center justify-start"
                : "w-full h-5 mt-1"
            }
          `}
        >
          <div
            className={`
              absolute 
              inset-0 
              flex 
              items-center 
              ${horizontalCount ? "justify-start" : "justify-center"}
              transition-all 
              duration-300 
              ${
                horizontalCount
                  ? isActivated
                    ? "-translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
                  : isActivated
                  ? "-translate-y-full opacity-0"
                  : "translate-y-0 opacity-100"
              }
            `}
          >
            <span
              className={`
                text-sm 
                text-gray-400 
                whitespace-nowrap
              `}
            >
              {count}
            </span>
          </div>
          <div
            className={`
              absolute 
              inset-0 
              flex 
              items-center 
              ${horizontalCount ? "justify-start" : "justify-center"}
              transition-all 
              duration-300 
              ${
                horizontalCount
                  ? isActivated
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-100"
                  : isActivated
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0"
              }
            `}
          >
            <span
              className={`text-sm whitespace-nowrap ${
                isActivated ? activeColor : "text-inherit"
              }`}
            >
              {count}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
