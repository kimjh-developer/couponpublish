"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "grid" | "list";

export interface CouponSettings {
  prefix: string;
  total: number;
  startIndex: number;
  /** Center X (in 1054×1492 image coord space) */
  textX: number;
  /** Center Y (in 1054×1492 image coord space) */
  textY: number;
  /** Force-fit text width in image px. 0 = no constraint (natural width) */
  textWidth: number;
  fontSize: number;
  fontColor: string;
  letterSpacing: number;
  qrSize: number;
  qrX: number;
  qrY: number;
  qrUrl: string;
}

export const DEFAULTS: CouponSettings = {
  prefix: "SUGO-OPEN-EVENT",
  total: 1000,
  startIndex: 1,
  textX: 315,
  textY: 685,
  textWidth: 400,
  fontSize: 44,
  fontColor: "#0b3a8c",
  letterSpacing: 1.2,
  qrSize: 195,
  qrX: 612,
  qrY: 558,
  qrUrl: "https://sugohero.onelink.me/esFP/8r5i3rkz",
};

interface CouponState {
  search: string;
  viewMode: ViewMode;
  settings: CouponSettings;
  setSearch: (search: string) => void;
  setViewMode: (mode: ViewMode) => void;
  updateSettings: (patch: Partial<CouponSettings>) => void;
  resetSettings: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      search: "",
      viewMode: "grid",
      settings: DEFAULTS,
      setSearch: (search) => set({ search }),
      setViewMode: (viewMode) => set({ viewMode }),
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      resetSettings: () => set({ settings: DEFAULTS }),
    }),
    {
      name: "sugohero-coupon-ui",
      version: 3,
      partialize: (state) => ({
        viewMode: state.viewMode,
        settings: state.settings,
      }),
      migrate: (_persisted, _fromVersion) => ({
        viewMode: "grid" as ViewMode,
        settings: DEFAULTS,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CouponState>;
        return {
          ...current,
          viewMode: p.viewMode ?? current.viewMode,
          settings: { ...DEFAULTS, ...(p.settings ?? {}) },
        };
      },
    },
  ),
);
