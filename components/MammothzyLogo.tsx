"use client";

import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MammothzyLogo({
  size = "md",
  className = "",
}: LogoProps) {
  // Figma spec:
  // md -> 195x75
  // lg -> 250x96
  // sm -> 140x54 (scaled proportionally)
  const dims = {
    sm: { w: 140, h: 54 },
    md: { w: 195.26, h: 75 },
    lg: { w: 250, h: 96 },
  };

  const { w, h } = dims[size];

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/mammothzy-logo.png"
        alt="Mammothzy Logo"
        width={w}
        height={h}
        className="object-contain"
        style={{ width: `${w}px`, height: `${h}px` }}
        priority
      />
    </div>
  );
}