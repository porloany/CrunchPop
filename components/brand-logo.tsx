import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      aria-label="CrunchPop"
      role="img"
    >
      <Image
        src="/logo.png"
        alt=""
        fill
        priority={!compact}
        sizes={
          compact
            ? "(max-width: 640px) 170px, 188px"
            : "(max-width: 640px) 360px, 410px"
        }
        className="object-cover"
        style={{ objectPosition: compact ? "50% 24%" : "50% 21%" }}
      />
    </span>
  );
}
