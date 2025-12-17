"use client";

import { clsx } from "clsx";
import React from "react";

export type SectionCell = {
  id?: number;
  label?: string;
  count?: number;
  selected?: boolean;
  onSelect?: (id: number) => void;
};

const layout: (number | null)[] = [1, null, 2, 3, null, 4, 5, null, 6];

export function SectionGrid({ cells, title }: { cells: SectionCell[]; title?: string }) {
  const cellMap = new Map<number, SectionCell>();
  cells.forEach((cell) => {
    if (cell.id) cellMap.set(cell.id, cell);
  });

  return (
    <div className="flex flex-col gap-2">
      {title ? <p className="text-sm font-semibold uppercase text-slate-500">{title}</p> : null}
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {layout.map((slot, idx) => {
          if (!slot) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-16 rounded-lg border border-dashed border-slate-200 bg-slate-50"
              />
            );
          }
          const cell = cellMap.get(slot);
          const isClickable = Boolean(cell?.onSelect);
          return (
            <button
              key={`slot-${slot}`}
              type="button"
              onClick={() => cell?.onSelect?.(slot)}
              className={clsx(
                "flex min-h-16 flex-col justify-between rounded-lg border p-3 text-left shadow-sm transition",
                isClickable ? "hover:border-emerald-500 active:scale-[0.99]" : "cursor-default",
                cell?.selected ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Zone {slot}</span>
                <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                  {cell?.count ?? 0} défaut(s)
                </span>
              </div>
              <p className="text-xs text-slate-500">{cell?.label || "Contrôle visuel & faisceau"}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

