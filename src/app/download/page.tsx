"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { AdminShell } from "@/components/AdminShell";
import { CouponCard } from "@/components/CouponCard";
import { buildCouponCode } from "@/lib/coupons";
import { renderCouponToBlob } from "@/lib/renderCouponToCanvas";
import { useCouponStore } from "@/store/couponStore";

export default function DownloadPage() {
  const settings = useCouponStore((s) => s.settings);
  const { startIndex, total: totalSetting, prefix } = settings;
  const lastIndex = startIndex + totalSetting - 1;

  const [from, setFrom] = useState(startIndex);
  const [to, setTo] = useState(lastIndex);
  const [confirmed, setConfirmed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef(false);

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

  const presets = [
    { label: `전체 (${startIndex} ~ ${lastIndex})`, from: startIndex, to: lastIndex },
    { label: "처음 100장", from: startIndex, to: Math.min(startIndex + 99, lastIndex) },
    { label: "처음 500장", from: startIndex, to: Math.min(startIndex + 499, lastIndex) },
  ];

  const handleDownload = useCallback(async () => {
    if (range.length === 0) return;
    setDownloading(true);
    setProgress(0);
    cancelRef.current = false;

    try {
      const zip = new JSZip();
      const BATCH = 5;

      for (let i = 0; i < range.length; i += BATCH) {
        if (cancelRef.current) break;
        const batch = range.slice(i, i + BATCH);
        const blobs = await Promise.all(
          batch.map((idx) => renderCouponToBlob(idx, settings)),
        );
        blobs.forEach((blob, j) => {
          const code = buildCouponCode(prefix, batch[j]);
          zip.file(`${code}.png`, blob);
        });
        setProgress(Math.min(i + BATCH, range.length));
        // Yield to UI
        await new Promise((r) => setTimeout(r, 0));
      }

      if (!cancelRef.current) {
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${prefix}_${from}-${to}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  }, [range, settings, prefix, from, to]);

  const handleCancel = () => {
    cancelRef.current = true;
  };

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
          onClick={handleDownload}
          disabled={!confirmed || downloading}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--toss-blue)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--toss-blue-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Download size={15} strokeWidth={2.4} />
          )}
          <span>
            {downloading
              ? `${progress} / ${range.length} 생성 중...`
              : `${total.toLocaleString()}장 다운로드`}
          </span>
        </button>
      </header>

      <div className="px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[22px] font-bold text-[var(--toss-gray-900)]">
            일괄 이미지 다운로드
          </h1>
          <p className="mt-1 text-[13px] text-[var(--toss-gray-500)]">
            쿠폰을 개별 PNG 이미지로 생성한 뒤 ZIP 파일로 한번에 다운로드합니다.
          </p>
          <p className="mt-1 text-[12px] text-[var(--toss-gray-500)]">
            현재 설정 코드:{" "}
            <span className="font-mono">
              {prefix}-{startIndex} ~ {prefix}-{lastIndex}
            </span>
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
                  다운로드할 쿠폰 수
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
                500장 이상은 이미지 생성에 시간이 걸릴 수 있어요.
              </p>
            )}
          </div>

          {confirmed && (
            <div className="mt-6 rounded-2xl border border-[var(--toss-gray-200)] bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[var(--toss-gray-800)]">
                  미리보기 ({range.length.toLocaleString()}장)
                </p>
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
                  처음 12장만 표시 — 나머지{" "}
                  {(range.length - 12).toLocaleString()}장은 다운로드 시 함께
                  포함됩니다.
                </p>
              )}

              {downloading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12px] text-[var(--toss-gray-600)]">
                    <span>
                      이미지 생성 중... {progress} / {range.length}
                    </span>
                    <button
                      onClick={handleCancel}
                      className="text-red-500 hover:underline"
                    >
                      취소
                    </button>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--toss-gray-200)]">
                    <div
                      className="h-full rounded-full bg-[var(--toss-blue)] transition-all"
                      style={{
                        width: `${(progress / range.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
