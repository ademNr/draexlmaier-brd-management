import { AnalyticsSummary } from "@/lib/data";

type ChartRowProps = { label: string; value: number; max?: number };

function ChartRow({ label, value, max }: ChartRowProps) {
  const width = max && max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-sm text-slate-600">{label}</div>
      <div className="relative h-3 flex-1 rounded-full bg-slate-100">
        <div
          className="absolute left-0 top-0 h-3 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

export function AnalyticsPanel({ analytics }: { analytics: AnalyticsSummary }) {
  const maxType = Math.max(...analytics.defectsByType.map((d) => d.value), 1);
  const maxSection = Math.max(...analytics.defectsPerSection.map((d) => d.value), 1);
  const maxShift = Math.max(...analytics.defectsPerShift.map((d) => d.value), 1);
  const maxTime = Math.max(...(analytics.timeSeries ?? []).map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">Défauts par type</p>
        <div className="mt-2 flex flex-col gap-2">
          {analytics.defectsByType.map((row) => (
            <ChartRow key={row.label} label={row.label} value={row.value} max={maxType} />
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Sections</p>
          <div className="mt-2 flex flex-col gap-2">
            {analytics.defectsPerSection.map((row) => (
              <ChartRow key={row.label} label={row.label} value={row.value} max={maxSection} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Équipes / shifts</p>
          <div className="mt-2 flex flex-col gap-2">
            {analytics.defectsPerShift.length === 0 ? (
              <span className="text-xs text-slate-400">Pas encore de données</span>
            ) : (
              analytics.defectsPerShift.map((row) => (
                <ChartRow key={row.label} label={row.label} value={row.value} max={maxShift} />
              ))
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">Défauts dans le temps</p>
        <div className="mt-2 flex flex-col gap-2">
          {(analytics.timeSeries ?? []).length === 0 ? (
            <span className="text-xs text-slate-400">Pas encore de données</span>
          ) : (
            (analytics.timeSeries ?? []).map((row) => (
              <ChartRow key={row.label} label={row.label} value={row.value} max={maxTime} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

