import React from "react";
import { XIcon } from "./icons";
import { CustomBadgeProps } from "@/typings/interfaces";

const CustomBadge = ({
  value,
  uniQueKey,
  onRemove,
  classes,
}: CustomBadgeProps) => {
  return (
    <div
      key={uniQueKey}
      className="border-transparent cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {value}
      <div onClick={onRemove} className="ml-1">
        <XIcon h="12" w="12" classes={classes} />
      </div>
    </div>
  );
};

export default CustomBadge;
