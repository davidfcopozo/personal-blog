import { ImageCardPropsInterface } from "@/typings/interfaces";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageCard({
  image,
  isSelected,
  onSelect,
}: ImageCardPropsInterface) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
        isSelected ?? "hover:opacity-80"
      )}
      onClick={onSelect}
    >
      <Image
        src={image.url || "/placeholder.svg"}
        alt={image.name}
        className="w-full h-full object-cover"
        width={500}
        height={500}
      />
      {isSelected && (
        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
          <div className="bg-[#34B233]/50 rounded-full p-1">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
