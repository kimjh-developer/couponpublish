"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import { CouponCard } from "./CouponCard";
import { buildCouponCode } from "@/lib/coupons";
import { useCouponStore } from "@/store/couponStore";

interface CouponPreviewProps {
  index: number;
}

export function CouponPreview({ index }: CouponPreviewProps) {
  const prefix = useCouponStore((s) => s.settings.prefix);
  const code = buildCouponCode(prefix, index);

  return (
    <div className="rounded-xl border border-[var(--toss-gray-200)] bg-white p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <Link href={`/coupons/${index}`} className="block">
        <div className="overflow-hidden rounded-lg bg-[var(--toss-gray-100)]">
          <CouponCard index={index} />
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-medium text-[var(--toss-gray-500)]">
            #{index.toString().padStart(4, "0")}
          </span>
          <span className="truncate text-[13px] font-semibold text-[var(--toss-gray-800)]">
            {code}
          </span>
        </div>
        <Link
          href={`/coupons/${index}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--toss-gray-500)] hover:bg-[var(--toss-gray-100)] hover:text-[var(--toss-blue)]"
          title="미리보기 및 인쇄"
        >
          <Printer size={16} />
        </Link>
      </div>
    </div>
  );
}
