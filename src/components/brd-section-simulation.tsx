type SectionInfo = { id: number; count: number; defects: string[] };

const layout: (number | null)[] = [1, null, 2, 3, null, 4, 5, null, 6];

export function BrdSectionSimulation({
  bbNumber,
  kskNumber,
  sections,
}: {
  bbNumber: string;
  kskNumber?: string;
  sections: SectionInfo[];
}) {
  const map = new Map<number, SectionInfo>();
  sections.forEach((s) => map.set(s.id, s));

  return (
    <div className="overflow-x-auto rounded-2xl border-4 border-slate-900 bg-white shadow-lg">
      <div className="grid grid-cols-2 border-b-4 border-slate-900 text-center text-sm font-semibold uppercase">
        <div className="border-r-4 border-slate-900 px-3 py-2">BB : {bbNumber}</div>
        <div className="px-3 py-2">KSK : {kskNumber || "—"}</div>
      </div>
      <div className="grid grid-cols-3 grid-rows-3">
        {layout.map((slot, idx) => {
          if (!slot) {
            return <div key={`empty-${idx}`} className="border border-slate-300 bg-slate-100" />;
          }
          const data = map.get(slot);
          return (
            <div
              key={`slot-${slot}`}
              className="flex min-h-28 flex-col gap-2 border border-slate-900 bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-cyan-600 px-2 py-1 text-xs font-bold text-white">Zone {slot}</span>
                <span className="text-xs font-semibold text-slate-700">{data?.count ?? 0} défaut(s)</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[11px] text-slate-700">
                {(data?.defects ?? []).length === 0 ? (
                  <span className="text-slate-400">Aucun défaut saisi</span>
                ) : (
                  data?.defects.map((d) => (
                    <span key={d} className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-800">
                      {d}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

