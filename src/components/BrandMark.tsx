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
          className="object-contain drop-shadow-[0_18px_36px_rgba(88,63,58,0.22)]"
        />
      </div>

      {showWordmark && (
        <div className="pb-1">
          <span
            className={`bg-[linear-gradient(135deg,#ccb291_8%,#b58f7e_34%,#bca2dc_76%,#7a657d_100%)] bg-clip-text font-script leading-none tracking-[-0.05em] text-transparent ${wordmarkSize[size]}`}
          >
            Travie
          </span>
        </div>
      )}
    </div>
  );
}
