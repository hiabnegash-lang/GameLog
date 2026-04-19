import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { container: "w-6 h-6", text: "text-xs" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-lg" },
  xl: { container: "w-20 h-20", text: "text-2xl" },
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { container, text } = sizeMap[size];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden bg-dark-hover flex-shrink-0", container, className)}>
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center font-semibold text-white flex-shrink-0",
        container,
        text,
        className
      )}
    >
      {initials}
    </div>
  );
}
