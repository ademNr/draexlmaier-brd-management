"use client";

import { useEffect, useState } from "react";
import { DEFECT_COLORS, DEFECT_TYPES } from "@/lib/constants";

type Series = { type: string; points: { label: string; value: number }[] };

const intervals = [
  { id: "hour", label: "Heures", days: 2 },
  { id: "day", label: "Jours", days: 30 },
  { id: "week", label: "Semaines", days: 120 },
];

type Props = { initial: Series[]; brdId?: string };

export function AnalyticsTimeType({ initial, brdId }: Props) {
  const [interval, setInterval] = useState<"hour" | "day" | "week">("hour");
  const [series, setSeries] = useState<Series[]>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const sel = intervals.find((i) => i.id === interval);
        const days = sel?.days ?? 30;
        const res = await fetch(
          `/api/analytics/summary?interval=${interval}${brdId ? `&brdId=${brdId}` : ""}&days=${days}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json = await res.json();
          setSeries(json.data.timeSeriesByType ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [interval, brdId]);

  const labels = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.label)))).sort();
  const max = Math.max(...series.flatMap((s) => s.points.map((p) => p.value)), 1);
  const width = Math.max(320, labels.length * 60);
  const height = 220;

  function buildPath(points: { label: string; value: number }[]) {
    if (labels.length === 0) return "";
    const coords = labels.map((label, idx) => {
      const p = points.find((pt) => pt.label === label);
      const v = p?.value ?? 0;
      const x = (idx / Math.max(1, labels.length - 1)) * (width - 40) + 20;
      const y = height - 30 - (v / max) * (height - 60);
      return { x, y };
    });
    return coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Défauts dans le temps par type</p>
          <p className="text-xs text-slate-500">Choix de granularité</p>
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

      <div className="mt-4 overflow-x-auto">
        {labels.length === 0 ? (
          <span className="text-xs text-slate-500">Pas de données</span>
        ) : (
          <svg width={width} height={height} className="min-w-[360px]">
            <g>
              {/* grid lines + y labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = height - 30 - t * (height - 60);
                const val = Math.round(max * t);
                return (
                  <g key={t}>
                    <line x1={24} y1={y} x2={width - 10} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={18} y={y + 4} fontSize="10" textAnchor="end" fill="#94a3b8">
                      {val}
                    </text>
                  </g>
                );
              })}
              {/* axes */}
              <line x1={24} y1={height - 30} x2={width - 10} y2={height - 30} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={24} y1={height - 30} x2={24} y2={20} stroke="#94a3b8" strokeWidth="1.5" />
              {/* series */}
              {DEFECT_TYPES.map((type) => {
                const s = series.find((r) => r.type === type);
                if (!s) return null;
                const path = buildPath(s.points);
                return (
                  <g key={type}>
                    <path
                      d={path}
                      fill="none"
                      stroke={DEFECT_COLORS[type] || "#22c55e"}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                    />
                    {labels.map((label, idx) => {
                      const p = s.points.find((pt) => pt.label === label);
                      const v = p?.value ?? 0;
                      const x = (idx / Math.max(1, labels.length - 1)) * (width - 40) + 24;
                      const y = height - 30 - (v / max) * (height - 60);
                      return (
                        <circle
                          key={`${type}-${label}`}
                          cx={x}
                          cy={y}
                          r={3}
                          fill={DEFECT_COLORS[type] || "#22c55e"}
                          stroke="white"
                          strokeWidth={1}
                        />
                      );
                    })}
                  </g>
                );
              })}
              {/* x labels */}
              {labels.map((label, idx) => {
                const x = (idx / Math.max(1, labels.length - 1)) * (width - 40) + 24;
                return (
                  <text
                    key={label}
                    x={x}
                    y={height - 12}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#475569"
                    transform={`rotate(0, ${x}, ${height - 12})`}
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          </svg>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
        {DEFECT_TYPES.map((type) => (
          <span key={type} className="flex items-center gap-2 text-slate-600">
            <span className="h-3 w-3 rounded-sm" style={{ background: DEFECT_COLORS[type] || "#e2e8f0" }} />
            {type}
          </span>
        ))}
      </div>
      {loading ? <p className="mt-2 text-xs text-slate-400">Chargement...</p> : null}
    </div>
  );
}

