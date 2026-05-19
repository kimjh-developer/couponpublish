"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Printer,
  Download,
  Ticket,
  HelpCircle,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/", label: "쿠폰 목록", icon: LayoutGrid },
  { href: "/print", label: "일괄 인쇄", icon: Printer },
  { href: "/download", label: "이미지 다운로드", icon: Download },
];

const utility = [
  { href: "#", label: "설정", icon: Settings },
  { href: "#", label: "도움말", icon: HelpCircle },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-[var(--toss-gray-50)]">
      {/* Sidebar */}
      <aside className="no-print sticky top-0 h-screen w-[244px] shrink-0 border-r border-[var(--toss-gray-200)] bg-white">
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--toss-blue)] text-white">
            <Ticket size={20} strokeWidth={2.4} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-[var(--toss-gray-900)]">
              SUGO HERO
            </span>
            <span className="text-[11px] font-medium text-[var(--toss-gray-500)]">
              쿠폰 어드민
            </span>
          </div>
        </div>

        <nav className="px-3 pt-2">
          <p className="px-3 py-2 text-[11px] font-semibold tracking-wide text-[var(--toss-gray-500)]">
            메뉴
          </p>
          <ul className="flex flex-col gap-0.5">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--toss-blue-light)] text-[var(--toss-blue)]"
                        : "text-[var(--toss-gray-700)] hover:bg-[var(--toss-gray-100)]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 px-3 py-2 text-[11px] font-semibold tracking-wide text-[var(--toss-gray-500)]">
            기타
          </p>
          <ul className="flex flex-col gap-0.5">
            {utility.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[var(--toss-gray-500)] hover:bg-[var(--toss-gray-100)]"
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-5">
          <div className="rounded-xl bg-[var(--toss-gray-100)] p-3">
            <p className="text-[12px] font-semibold text-[var(--toss-gray-800)]">
              오픈 이벤트 쿠폰
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--toss-gray-500)]">
              SUGO-OPEN-EVENT-1 ~ 1000
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
