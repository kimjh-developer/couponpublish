"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Printer, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { CouponCard } from "@/components/CouponCard";
import { useCouponStore } from "@/store/couponStore";

export default function PrintBulkPage() {
  const { startIndex, total: totalSetting, prefix } = useCouponStore(
    (s) => s.settings,
  );
  const lastIndex = startIndex + totalSetting - 1;

  const [from, setFrom] = useState(startIndex);
  const [to, setTo] = useState(lastIndex);
  const [confirmed, setConfirmed] = useState(false);
  const [rendering, setRendering] = useState(false);

  // Sync inputs when global settings change
  useEffect(() => {
    setFrom(startIndex);
    setTo(lastIndex);
    setConfirmed(false);
  }, [startIndex, lastIndex]);

  const total = Math.max(0, to - from + 1);

  const range = useMemo(() => {
    if (!confirmed) return [] as number[];
    const a = Math.min(from, to);
    const b = Math.max(from, to);
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }, [confirmed, from, to]);

  useEffect(() => {
    if (!confirmed) return;
    setRendering(true);
    const t = window.setTimeout(() => setRendering(false), 250);
    return () => window.clearTimeout(t);
  }, [confirmed, range.length]);

  const presets = [
    { label: `전체 (${startIndex} ~ ${lastIndex})`, from: startIndex, to: lastIndex },
    { label: "처음 100장", from: startIndex, to: Math.min(startIndex + 99, lastIndex) },
    { label: "처음 500장", from: startIndex, to: Math.min(startIndex + 499, lastIndex) },
  ];

  return (
    <AdminShell>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--toss-gray-200)] bg-white/80 px-8 backdrop-blur-md no-print">
        <Link
          href="/"
          className="flex items-center gap-1 text-[14px] font-medium text-[var(--toss-gray-600)] transition-colors hover:text-[var(--toss-gray-900)]"
        >
          <ChevronLeft size={18} />
          <span>목록으로</span>
        </Link>
        <button
          onClick={() => window.print()}
          disabled={!confirmed || rendering}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--toss-blue)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--toss-blue-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {rendering ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Printer size={15} strokeWidth={2.4} />
          )}
          <span>{total.toLocaleString()}장 인쇄하기</span>
        </button>
      </header>

      <div className="px-8 py-8 no-print">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[22px] font-bold text-[var(--toss-gray-900)]">
            일괄 인쇄
          </h1>
          <p className="mt-1 text-[13px] text-[var(--toss-gray-500)]">
            인쇄할 쿠폰 번호 범위를 선택해주세요. A4 한 페이지에 한 장씩 출력됩니다.
          </p>
          <p className="mt-1 text-[12px] text-[var(--toss-gray-500)]">
            현재 설정 코드: <span className="font-mono">{prefix}-{startIndex} ~ {prefix}-{lastIndex}</span>
          </p>

          <div className="mt-6 rounded-2xl border border-[var(--toss-gray-200)] bg-white p-6">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="시작 번호"
                value={from}
                min={startIndex}
                max={lastIndex}
                onChange={(v) => {
                  setFrom(v);
                  setConfirmed(false);
                }}
              />
              <Field
                label="끝 번호"
                value={to}
                min={startIndex}
                max={lastIndex}
                onChange={(v) => {
                  setTo(v);
                  setConfirmed(false);
                }}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setFrom(p.from);
                    setTo(p.to);
                    setConfirmed(false);
                  }}
                  className="rounded-full border border-[var(--toss-gray-200)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--toss-gray-700)] transition-colors hover:border-[var(--toss-blue)] hover:text-[var(--toss-blue)]"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--toss-gray-100)] px-4 py-3">
              <div>
                <p className="text-[12px] text-[var(--toss-gray-600)]">
                  인쇄될 쿠폰 수
                </p>
                <p className="text-[18px] font-bold text-[var(--toss-gray-900)]">
                  {total.toLocaleString()}장
                </p>
              </div>
              <button
                onClick={() => setConfirmed(true)}
                disabled={total <= 0 || from < startIndex || to > lastIndex}
                className="h-10 rounded-lg bg-[var(--toss-blue)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--toss-blue-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                미리보기 생성
              </button>
            </div>

            {total > 500 && (
              <p className="mt-3 text-[12px] text-[var(--toss-gray-500)]">
                ⓘ 500장 이상은 렌더링에 몇 초가 걸릴 수 있어요.
              </p>
            )}
          </div>

          {confirmed && (
            <div className="mt-6 rounded-2xl border border-[var(--toss-gray-200)] bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[var(--toss-gray-800)]">
                  미리보기 ({range.length.toLocaleString()}장)
                </p>
                {rendering && (
                  <span className="flex items-center gap-1 text-[12px] text-[var(--toss-gray-500)]">
                    <Loader2 size={12} className="animate-spin" />
                    렌더링 중…
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {range.slice(0, 12).map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border border-[var(--toss-gray-100)] bg-[var(--toss-gray-50)]"
                  >
                    <CouponCard index={i} />
                  </div>
                ))}
              </div>
              {range.length > 12 && (
                <p className="mt-3 text-center text-[12px] text-[var(--toss-gray-500)]">
                  처음 12장만 표시 — 나머지 {(range.length - 12).toLocaleString()}장은
                  인쇄 시 함께 출력됩니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {confirmed && (
        <div className="print-only">
          {range.map((i) => (
            <div key={i} className="print-page">
              <div className="print-coupon">
                <CouponCard index={i} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[var(--toss-gray-600)]">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v)) return;
          onChange(Math.max(min, Math.min(max, Math.round(v))));
        }}
        className="h-11 rounded-xl border border-[var(--toss-gray-200)] bg-white px-3.5 text-[14px] font-semibold text-[var(--toss-gray-900)] outline-none transition-all focus:border-[var(--toss-blue)] focus:ring-4 focus:ring-[var(--toss-blue)]/10"
      />
    </label>
  );
}
