"use client";

import { QRCodeSVG } from "qrcode.react";
import { BASE_H, BASE_W, buildCouponCode } from "@/lib/coupons";
import { useCouponStore, type CouponSettings } from "@/store/couponStore";

interface CouponCardProps {
  index: number;
  className?: string;
  /** Optional override — falls back to store settings. Useful for live preview. */
  settings?: CouponSettings;
}

export function CouponCard({ index, className = "", settings }: CouponCardProps) {
  const store = useCouponStore((s) => s.settings);
  const s = settings ?? store;
  const code = buildCouponCode(s.prefix, index);

  return (
    <div
      className={`relative w-full select-none ${className}`}
      style={{ aspectRatio: `${BASE_W} / ${BASE_H}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coupon-base.png"
        alt="수거히어로 쿠폰"
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />

      <svg
        viewBox={`0 0 ${BASE_W} ${BASE_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <text
          x={s.textX}
          y={s.textY}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily='"Jalnan Gothic", "Pretendard", system-ui, sans-serif'
          fontWeight={400}
          fontSize={s.fontSize}
          fill={s.fontColor}
          letterSpacing={s.letterSpacing}
          {...(s.textWidth > 0
            ? { textLength: s.textWidth, lengthAdjust: "spacingAndGlyphs" as const }
            : {})}
        >
          {code}
        </text>

        <foreignObject x={s.qrX} y={s.qrY} width={s.qrSize} height={s.qrSize}>
          <div
            // @ts-expect-error xmlns required on the html child of foreignObject
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: "100%",
              height: "100%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              boxSizing: "border-box",
            }}
          >
            <QRCodeSVG
              value={s.qrUrl}
              level="M"
              marginSize={0}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
