"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Printer,
  Download,
  Ticket,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { CouponPreview } from "@/components/CouponPreview";
import { CouponSettingsPanel } from "@/components/CouponSettingsPanel";
import { allCouponIndices, buildCouponCode } from "@/lib/coupons";
import { useCouponStore } from "@/store/couponStore";

const PAGE_SIZE = 24;

export default function HomePage() {
  const search = useCouponStore((s) => s.search);
  const setSearch = useCouponStore((s) => s.setSearch);
  const settings = useCouponStore((s) => s.settings);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const all = allCouponIndices(settings.startIndex, settings.total);
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) => {
      const code = buildCouponCode(settings.prefix, i).toLowerCase();
      return code.includes(q) || String(i).includes(q);
    });
  }, [search, settings.startIndex, settings.total, settings.prefix]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <AdminShell>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--toss-gray-200)] bg-white/80 px-8 backdrop-blur-md no-print">
        <div className="flex items-center gap-2">
          <h1 className="text-[18px] font-bold text-[var(--toss-gray-900)]">
            쿠폰 목록
          </h1>
          <span className="rounded-full bg-[var(--toss-gray-100)] px-2 py-0.5 text-[12px] font-semibold text-[var(--toss-gray-600)]">
            {settings.total.toLocaleString()}건
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/download"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--toss-gray-200)] bg-white px-3.5 text-[13px] font-semibold text-[var(--toss-gray-700)] transition-colors hover:bg-[var(--toss-gray-100)]"
          >
            <Download size={15} strokeWidth={2.4} />
            <span>이미지 다운로드</span>
          </Link>
          <Link
            href="/print"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--toss-blue)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--toss-blue-hover)]"
          >
            <Printer size={15} strokeWidth={2.4} />
            <span>일괄 인쇄</span>
          </Link>
        </div>
      </header>

      <div className="px-8 py-6">
        <section className="grid grid-cols-3 gap-4 no-print">
          <StatCard
            icon={<Ticket size={18} />}
            label="발급 쿠폰"
            value={`${settings.total.toLocaleString()}장`}
            sub={`${settings.prefix}-${settings.startIndex} ~ ${settings.startIndex + settings.total - 1}`}
          />
          <StatCard
            icon={<CheckCircle2 size={18} />}
            label="유효 코드 범위"
            value={`${settings.startIndex} ~ ${settings.startIndex + settings.total - 1}`}
            sub="중복 없음, 순차 부여"
          />
          <StatCard
            icon={<Printer size={18} />}
            label="인쇄 규격"
            value="A4 · 1면 1장"
            sub={`총 ${settings.total.toLocaleString()}페이지`}
          />
        </section>

        <div className="mt-6">
          <CouponSettingsPanel />
        </div>

        <section className="mt-6 flex items-center gap-3 no-print">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--toss-gray-400)]"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="쿠폰 코드 또는 번호 검색"
              className="h-11 w-full rounded-xl border border-[var(--toss-gray-200)] bg-white pl-10 pr-4 text-[14px] text-[var(--toss-gray-900)] outline-none transition-all placeholder:text-[var(--toss-gray-400)] focus:border-[var(--toss-blue)] focus:ring-4 focus:ring-[var(--toss-blue)]/10"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--toss-gray-200)] bg-white px-3 py-2 text-[12px] font-medium text-[var(--toss-gray-600)]">
            <span className="text-[var(--toss-gray-500)]">검색 결과</span>
            <span className="font-semibold text-[var(--toss-gray-800)]">
              {filtered.length.toLocaleString()}건
            </span>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {pageItems.map((i) => (
            <CouponPreview key={i} index={i} />
          ))}
        </section>

        {pageItems.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--toss-gray-300)] bg-white py-16 text-center">
            <p className="text-[14px] font-medium text-[var(--toss-gray-600)]">
              검색 결과가 없어요
            </p>
            <p className="mt-1 text-[12px] text-[var(--toss-gray-500)]">
              쿠폰 번호 또는 코드를 다시 확인해주세요.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <section className="mt-8 flex items-center justify-center gap-1 no-print">
            <PageBtn
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft size={16} />
            </PageBtn>
            {pageNumbers(safePage, totalPages).map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-[13px] text-[var(--toss-gray-500)]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-[13px] font-semibold transition-colors ${
                    p === safePage
                      ? "bg-[var(--toss-blue)] text-white"
                      : "text-[var(--toss-gray-700)] hover:bg-[var(--toss-gray-100)]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <PageBtn
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              <ChevronRight size={16} />
            </PageBtn>
          </section>
        )}
      </div>
    </AdminShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--toss-gray-200)] bg-white p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--toss-blue-light)] text-[var(--toss-blue)]">
          {icon}
        </div>
        <span className="text-[12px] font-medium text-[var(--toss-gray-600)]">
          {label}
        </span>
      </div>
      <p className="mt-3 truncate text-[22px] font-bold tracking-tight text-[var(--toss-gray-900)]">
        {value}
      </p>
      <p className="mt-1 truncate text-[12px] text-[var(--toss-gray-500)]">
        {sub}
      </p>
    </div>
  );
}

function PageBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--toss-gray-600)] transition-colors hover:bg-[var(--toss-gray-100)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}
