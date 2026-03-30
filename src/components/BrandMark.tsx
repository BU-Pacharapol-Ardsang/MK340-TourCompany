import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const imageBox = {
  sm: "h-11 w-11",
  md: "h-16 w-16",
  lg: "h-40 w-40 sm:h-48 sm:w-48",
};

const imageSizes = {
  sm: 44,
  md: 64,
  lg: 192,
};

const wordmarkSize = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl sm:text-6xl",
};

export default function BrandMark({
  size = "md",
  showWordmark = false,
  className = "",
}: BrandMarkProps) {
  return (
    <div
      className={`flex items-end gap-3 ${showWordmark ? "" : "justify-center"} ${className}`}
    >
      <div className={`relative shrink-0 ${imageBox[size]}`}>
        <Image
          src="/logo/travie-logo.png"
          alt="Travie logo"
          fill
          sizes={`${imageSizes[size]}px`}
          className="object-contain drop-shadow-[0_18px_36px_rgba(21,74,136,0.22)]"
        />
      </div>

      {showWordmark && (
        <div className="pb-1">
          <span
            className={`bg-[linear-gradient(135deg,#66ccff_8%,#3f9cff_36%,#2e74ff_74%,#153d96_100%)] bg-clip-text font-script leading-none tracking-[-0.05em] text-transparent ${wordmarkSize[size]}`}
          >
            Travie
          </span>
        </div>
      )}
    </div>
  );
}
