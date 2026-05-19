"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Type,
  QrCode,
  Hash,
  Move,
} from "lucide-react";
import { CouponCard } from "@/components/CouponCard";
import { BASE_H, BASE_W } from "@/lib/coupons";
import { DEFAULTS, useCouponStore } from "@/store/couponStore";

export function CouponSettingsPanel() {
  const settings = useCouponStore((s) => s.settings);
  const updateSettings = useCouponStore((s) => s.updateSettings);
  const resetSettings = useCouponStore((s) => s.resetSettings);
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-2xl border border-[var(--toss-gray-200)] bg-white no-print">
      <header className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--toss-gray-900)]">
            쿠폰 설정
          </h2>
          <p className="mt-0.5 text-[12px] text-[var(--toss-gray-500)]">
            코드 / 장수 / 텍스트 · QR 위치와 크기를 입력하세요. 변경 즉시
            모든 쿠폰에 반영됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("기본값으로 되돌릴까요?")) resetSettings();
            }}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--toss-gray-200)] bg-white px-3 text-[12px] font-semibold text-[var(--toss-gray-700)] transition-colors hover:bg-[var(--toss-gray-100)]"
          >
            <RotateCcw size={14} />
            <span>기본값</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--toss-gray-600)] hover:bg-[var(--toss-gray-100)]"
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="grid grid-cols-1 gap-5 border-t border-[var(--toss-gray-100)] p-5 lg:grid-cols-[1fr_320px]">
          {/* Inputs */}
          <div className="flex flex-col gap-5">
            <Group title="코드 · 장수" icon={<Hash size={14} />}>
              <Field
                label="코드 접두어 (prefix)"
                value={settings.prefix}
                onChange={(v) => updateSettings({ prefix: v })}
                placeholder="SUGO-OPEN-EVENT"
                mono
              />
              <div className="grid grid-cols-2 gap-3">
                <NumField
                  label="시작 번호"
                  value={settings.startIndex}
                  min={0}
                  max={999_999}
                  onChange={(v) => updateSettings({ startIndex: v })}
                />
                <NumField
                  label="총 발급 장수"
                  value={settings.total}
                  min={1}
                  max={100_000}
                  onChange={(v) => updateSettings({ total: v })}
                />
              </div>
              <Field
                label="QR 링크 (URL)"
                value={settings.qrUrl}
                onChange={(v) => updateSettings({ qrUrl: v })}
                placeholder="https://..."
                mono
              />
              <p className="rounded-lg bg-[var(--toss-gray-100)] px-3 py-2 text-[11.5px] font-mono text-[var(--toss-gray-700)]">
                예: {settings.prefix}-{settings.startIndex} ~ {settings.prefix}-
                {settings.startIndex + settings.total - 1}
              </p>
            </Group>

            <Group title="쿠폰 코드 텍스트" icon={<Type size={14} />}>
              <div className="grid grid-cols-3 gap-3">
                <NumField
                  label="중심 X"
                  value={settings.textX}
                  min={0}
                  max={BASE_W}
                  onChange={(v) => updateSettings({ textX: v })}
                />
                <NumField
                  label="중심 Y"
                  value={settings.textY}
                  min={0}
                  max={BASE_H}
                  onChange={(v) => updateSettings({ textY: v })}
                />
                <NumField
                  label="가로 폭"
                  value={settings.textWidth}
                  min={0}
                  max={BASE_W}
                  onChange={(v) => updateSettings({ textWidth: v })}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <NumField
                  label="폰트 크기"
                  value={settings.fontSize}
                  min={8}
                  max={200}
                  onChange={(v) => updateSettings({ fontSize: v })}
                />
                <NumField
                  label="자간"
                  value={settings.letterSpacing}
                  min={-5}
                  max={20}
                  step={0.1}
                  onChange={(v) => updateSettings({ letterSpacing: v })}
                />
                <Field
                  label="글자 색"
                  value={settings.fontColor}
                  onChange={(v) => updateSettings({ fontColor: v })}
                  type="color"
                />
              </div>
              <p className="text-[11px] text-[var(--toss-gray-500)]">
                중심 X·Y는 텍스트의 중심점입니다. <b>가로 폭</b>을 지정하면 모든
                쿠폰의 텍스트가 그 폭에 맞게 균일하게 늘어나/줄어들며, <b>0</b>으로
                두면 폰트 자연폭 그대로 표시됩니다.
              </p>
            </Group>

            <Group title="QR 코드" icon={<QrCode size={14} />}>
              <div className="grid grid-cols-3 gap-3">
                <NumField
                  label="X"
                  value={settings.qrX}
                  min={0}
                  max={BASE_W}
                  onChange={(v) => updateSettings({ qrX: v })}
                />
                <NumField
                  label="Y"
                  value={settings.qrY}
                  min={0}
                  max={BASE_H}
                  onChange={(v) => updateSettings({ qrY: v })}
                />
                <NumField
                  label="크기 (한 변)"
                  value={settings.qrSize}
                  min={20}
                  max={BASE_W}
                  onChange={(v) => updateSettings({ qrSize: v })}
                />
              </div>
              <p className="flex items-center gap-1 text-[11px] text-[var(--toss-gray-500)]">
                <Move size={12} />
                원본 이미지 좌표(픽셀) 기준 · 캔버스 {BASE_W} × {BASE_H}
              </p>
            </Group>
          </div>

          {/* Live preview */}
          <aside className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--toss-gray-500)]">
              실시간 미리보기 ({settings.prefix}-{settings.startIndex})
            </p>
            <div className="overflow-hidden rounded-xl border border-[var(--toss-gray-200)] bg-[var(--toss-gray-50)]">
              <CouponCard index={settings.startIndex} settings={settings} />
            </div>
            <p className="text-[11px] text-[var(--toss-gray-500)]">
              좌표를 변경하면 미리보기가 즉시 업데이트됩니다.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

function Group({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--toss-gray-200)] p-4">
      <div className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--toss-gray-700)]">
        <span className="text-[var(--toss-gray-500)]">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-[var(--toss-gray-600)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 rounded-lg border border-[var(--toss-gray-200)] bg-white px-3 text-[13px] text-[var(--toss-gray-900)] outline-none transition-all focus:border-[var(--toss-blue)] focus:ring-4 focus:ring-[var(--toss-blue)]/10 ${
          mono ? "font-mono" : ""
        } ${type === "color" ? "p-1" : ""}`}
      />
    </label>
  );
}

function NumField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-[var(--toss-gray-600)]">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isFinite(v)) return;
          const clamped = Math.max(min, Math.min(max, v));
          onChange(step < 1 ? Number(clamped.toFixed(2)) : Math.round(clamped));
        }}
        className="h-10 rounded-lg border border-[var(--toss-gray-200)] bg-white px-3 text-[13px] font-semibold text-[var(--toss-gray-900)] outline-none transition-all focus:border-[var(--toss-blue)] focus:ring-4 focus:ring-[var(--toss-blue)]/10"
      />
    </label>
  );
}
