"use client";

import Link from "next/link";
import { CouponCard } from "@/components/CouponCard";
import { buildCouponCode, isValidCouponIndex } from "@/lib/coupons";
import { useCouponStore } from "@/store/couponStore";

interface Props {
  index: number;
}

export function CouponDetailContent({ index }: Props) {
  const settings = useCouponStore((s) => s.settings);
  const valid = isValidCouponIndex(index, settings.startIndex, settings.total);

  if (!valid) {
    return (
      <div className="px-8 py-12 no-print">
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--toss-gray-200)] bg-white p-8 text-center">
          <p className="text-[16px] font-bold text-[var(--toss-gray-900)]">
            존재하지 않는 쿠폰입니다
          </p>
          <p className="mt-2 text-[13px] text-[var(--toss-gray-500)]">
            현재 설정된 범위는 {settings.startIndex} ~{" "}
            {settings.startIndex + settings.total - 1} 입니다.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-[var(--toss-blue)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--toss-blue-hover)]"
          >
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  const code = buildCouponCode(settings.prefix, index);

  return (
    <>
      <div className="px-8 py-8 no-print">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-[var(--toss-gray-200)] bg-white p-8">
            <div className="mx-auto max-w-[480px]">
              <CouponCard index={index} />
            </div>
          </section>

          <aside className="flex flex-col gap-4 no-print">
            <div className="rounded-2xl border border-[var(--toss-gray-200)] bg-white p-6">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--toss-gray-500)]">
                쿠폰 정보
              </p>
              <h2 className="mt-1 text-[22px] font-bold text-[var(--toss-gray-900)]">
                #{index.toString().padStart(4, "0")}
              </h2>
              <p className="mt-2 break-all rounded-lg bg-[var(--toss-gray-100)] px-3 py-2 font-mono text-[13px] font-semibold text-[var(--toss-gray-800)]">
                {code}
              </p>
              <dl className="mt-5 flex flex-col gap-3 text-[13px]">
                <Row
                  label="순번"
                  value={`${index} / ${settings.startIndex + settings.total - 1}`}
                />
                <Row label="QR 링크" value={settings.qrUrl} mono />
                <Row label="인쇄 규격" value="A4 · 1면 1장" />
              </dl>
            </div>

            <div className="rounded-2xl border border-[var(--toss-gray-200)] bg-white p-6">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--toss-gray-500)]">
                인쇄 안내
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 text-[12px] text-[var(--toss-gray-600)]">
                <li>• 인쇄 미리보기에서 여백을 ‘없음’으로 설정해주세요.</li>
                <li>• 배경 그래픽 인쇄 옵션을 켜야 합니다.</li>
                <li>• QR을 스캔하면 설정된 URL로 이동합니다.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="print-only">
        <div className="print-page">
          <div className="print-coupon">
            <CouponCard index={index} />
          </div>
        </div>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-[var(--toss-gray-100)] pt-3 first:border-t-0 first:pt-0">
      <dt className="shrink-0 text-[var(--toss-gray-500)]">{label}</dt>
      <dd
        className={`text-right font-medium text-[var(--toss-gray-800)] ${
          mono ? "break-all font-mono text-[11.5px]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
