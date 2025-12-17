"use client";

import { DEFECT_COLORS, DEFECT_TYPES } from "@/lib/constants";

type PerSectionType = { section: number; type: string; value: number };

export function AnalyticsZoneType({ data }: { data: PerSectionType[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const sections = Array.from(new Set(data.map((d) => d.section))).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">Défauts par zone et type</p>
      <p className="text-xs text-slate-500">Barres empilées par section</p>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Défauts par zone">
        {sections.map((section) => {
          const rows = DEFECT_TYPES.map((type) => {
            const item = data.find((d) => d.section === section && d.type === type);
            return { type, value: item?.value ?? 0 };
          });
          return (
            <div key={section} className="flex flex-col items-center gap-2">
              <div className="flex flex-col justify-end rounded-lg border border-slate-200 bg-slate-50 px-2 pb-2 pt-1 shadow-inner">
                {rows.map((row) => (
                  <div
                    key={row.type}
                    className="w-12 sm:w-14"
                    style={{
                      height: `${row.value === 0 ? 2 : Math.max(6, (row.value / max) * 120)}px`,
                      background: DEFECT_COLORS[row.type] || "#e2e8f0",
                      marginTop: "2px",
                      borderRadius: "4px",
                    }}
                    title={`${row.type} : ${row.value}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">Zone {section}</span>
              <span className="text-[11px] text-slate-500">{rows.reduce((s, r) => s + r.value, 0)} défaut(s)</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
        {DEFECT_TYPES.map((type) => (
          <span key={type} className="flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-sm" style={{ background: DEFECT_COLORS[type] || "#e2e8f0" }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

