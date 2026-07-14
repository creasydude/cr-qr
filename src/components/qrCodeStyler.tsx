"use client";

import { useEffect, useRef, useCallback } from "react";
import QRCodeStyling, {
  type Options,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
} from "qr-code-styling";

export interface StylePreset {
  name: string;
  dots: DotType;
  cornerSquare: CornerSquareType;
  cornerDot: CornerDotType;
}

export const stylePresets: StylePreset[] = [
  {
    name: "Clean",
    dots: "rounded",
    cornerSquare: "square",
    cornerDot: "square",
  },
  {
    name: "Classic",
    dots: "square",
    cornerSquare: "square",
    cornerDot: "square",
  },
  {
    name: "Soft",
    dots: "rounded",
    cornerSquare: "extra-rounded",
    cornerDot: "dot",
  },
  {
    name: "Bold",
    dots: "extra-rounded",
    cornerSquare: "extra-rounded",
    cornerDot: "square",
  },
  {
    name: "Elegant",
    dots: "classy",
    cornerSquare: "square",
    cornerDot: "dot",
  },
];

interface QrCodeStylerProps {
  value: string;
  size?: number;
  fgColor: string;
  bgColor: string;
  errorCorrection: "L" | "M" | "Q" | "H";
  stylePreset: StylePreset;
  logo?: string | null;
}

export function QrCodeStyler({
  value,
  size = 250,
  fgColor,
  bgColor,
  errorCorrection,
  stylePreset,
  logo,
}: QrCodeStylerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const buildOptions = useCallback(
    (): Partial<Options> => ({
      type: "svg",
      width: size,
      height: size,
      margin: 0,
      data: value,
      image: logo || undefined,
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
      dotsOptions: {
        type: stylePreset.dots,
        color: fgColor,
      },
      cornersSquareOptions: {
        type: stylePreset.cornerSquare,
        color: fgColor,
      },
      cornersDotOptions: {
        type: stylePreset.cornerDot,
        color: fgColor,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 4,
      },
    }),
    [value, size, fgColor, bgColor, errorCorrection, stylePreset, logo]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !value) return;

    const qr = new QRCodeStyling(buildOptions());
    qrRef.current = qr;

    container.innerHTML = "";
    qr.append(container);

    return () => {
      container.innerHTML = "";
      qrRef.current = null;
    };
  }, [value, buildOptions]);

  // Expose getRawData for download
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      (container as HTMLDivElement & { __qrRef?: QRCodeStyling }).__qrRef = qrRef.current as QRCodeStyling;
    }
  });

  return <div ref={containerRef} className="flex justify-center" />;
}

export function downloadStyledQr(
  container: HTMLDivElement,
  extension: "svg" | "png"
): void {
  const qr = (container as HTMLDivElement & { __qrRef?: QRCodeStyling }).__qrRef;
  if (qr) {
    qr.download({ name: "qr-code", extension });
  }
}
