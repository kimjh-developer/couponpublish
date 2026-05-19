import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { CouponDetailActions } from "@/components/CouponDetailActions";
import { CouponDetailContent } from "@/components/CouponDetailContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CouponDetailPage({ params }: PageProps) {
  const { id } = await params;
  const index = Number(id);

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
        <CouponDetailActions index={index} />
      </header>

      <CouponDetailContent index={index} />
    </AdminShell>
  );
}
