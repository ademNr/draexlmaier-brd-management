"use client";

import { useEffect, useState } from "react";

const intervals = [
  { id: "hour", label: "Heures" },
  { id: "day", label: "Jours" },
  { id: "week", label: "Semaines" },
  { id: "month", label: "Mois" },
];

type Point = { label: string; value: number };

type Props = {
  initial: Point[];
  brdId?: string;
};

export function AnalyticsTimePanel({ initial, brdId }: Props) {
  const [interval, setInterval] = useState<"hour" | "day" | "week" | "month">("hour");
  const [data, setData] = useState<Point[]>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analytics/summary?interval=${interval}${brdId ? `&brdId=${brdId}` : ""}&days=${
            interval === "month" ? 180 : interval === "week" ? 90 : 30
          }`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json = await res.json();
          setData(json.data.timeSeries || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [interval, brdId]);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Évolution des défauts</p>
          <p className="text-xs text-slate-500">Vue par heures / jours / semaines / mois</p>
        </div>
        <div className="flex gap-2">
          {intervals.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setInterval(i.id as typeof interval)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                interval === i.id
                  ? "bg-emerald-600 text-white ring-emerald-700"
                  : "bg-white text-slate-800 ring-slate-200 hover:ring-emerald-400"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2 overflow-x-auto pb-2">
        {data.length === 0 ? (
          <span className="text-xs text-slate-500">Pas de données</span>
        ) : (
          data.map((point) => (
            <div key={point.label} className="flex flex-col items-center gap-1">
              <div
                className="w-8 rounded-t bg-emerald-500 transition-all"
                style={{ height: `${Math.max(6, (point.value / max) * 160)}px` }}
              />
              <span className="text-[11px] text-slate-600">{point.value}</span>
              <span className="w-12 text-center text-[10px] text-slate-500">{point.label}</span>
            </div>
          ))
        )}
      </div>
      {loading ? <p className="mt-2 text-xs text-slate-400">Chargement...</p> : null}
    </div>
  );
}

