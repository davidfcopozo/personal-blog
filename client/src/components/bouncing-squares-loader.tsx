"use client";
import { BouncingCircles } from "./icons";

export default function BouncingCirclesLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-200">
      <div className="flex items-center justify-center space-x-2">
        <BouncingCircles />
      </div>
    </div>
  );
}
