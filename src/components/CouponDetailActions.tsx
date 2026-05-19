"use client";

import Link from "next/link";
import { Printer, ChevronRight, ChevronLeft } from "lucide-react";
import { useCouponStore } from "@/store/couponStore";

interface Props {
  index: number;
}

export function CouponDetailActions({ index }: Props) {
  const { startIndex, total } = useCouponStore((s) => s.settings);
  const lastIndex = startIndex + total - 1;
  const prev = index > startIndex ? index - 1 : null;
  const next = index < lastIndex ? index + 1 : null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 items-stretch overflow-hidden rounded-lg border border-[var(--toss-gray-200)] bg-white text-[13px] font-semibold">
        {prev ? (
          <Link
            href={`/coupons/${prev}`}
            className="flex items-center gap-0.5 px-2.5 text-[var(--toss-gray-700)] transition-colors hover:bg-[var(--toss-gray-100)]"
          >
            <ChevronLeft size={15} />
            <span>이전</span>
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-0.5 px-2.5 text-[var(--toss-gray-400)]">
            <ChevronLeft size={15} />
            <span>이전</span>
          </span>
        )}
        <span className="flex items-center border-l border-[var(--toss-gray-200)] px-3 text-[var(--toss-gray-500)]">
          {index} / {lastIndex}
        </span>
        {next ? (
          <Link
            href={`/coupons/${next}`}
            className="flex items-center gap-0.5 border-l border-[var(--toss-gray-200)] px-2.5 text-[var(--toss-gray-700)] transition-colors hover:bg-[var(--toss-gray-100)]"
          >
            <span>다음</span>
            <ChevronRight size={15} />
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-0.5 border-l border-[var(--toss-gray-200)] px-2.5 text-[var(--toss-gray-400)]">
            <span>다음</span>
            <ChevronRight size={15} />
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--toss-blue)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--toss-blue-hover)]"
      >
        <Printer size={15} strokeWidth={2.4} />
        <span>이 쿠폰 인쇄</span>
      </button>
    </div>
  );
}
