import { BRAND } from "../assets/brand";

type OasisLogoVariant = "mark" | "horizontal" | "vertical";

type OasisLogoProps = {
  size?: number;
  height?: number;
  variant?: OasisLogoVariant;
  alt?: string;
};

export function OasisLogo({
  size = 28,
  height,
  variant = "mark",
  alt = "Intrinsic Systems",
}: OasisLogoProps) {
  const src =
    variant === "horizontal"
      ? BRAND.logo
      : variant === "vertical"
      ? BRAND.logoVertical
      : BRAND.mark;

  const resolvedHeight =
    height ?? (variant === "horizontal" ? 34 : variant === "vertical" ? 64 : size);

  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        objectFit: "contain",
        width: variant === "mark" ? size : "auto",
        height: resolvedHeight,
      }}
    />
  );
}