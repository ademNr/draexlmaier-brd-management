import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DefectLogDocument } from "@/lib/models/defect-log";

type Props = { defects: DefectLogDocument[]; kskNumber?: string };

export function DefectHistoryList({ defects, kskNumber }: Props) {
  const filtered = kskNumber ? defects.filter((d) => d.kskNumber === kskNumber) : defects;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
        {kskNumber ? `Aucun défaut pour KSK ${kskNumber}.` : "Aucun défaut saisi pour ce BRD."}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Historique des défauts</p>
        <span className="text-xs text-slate-500">{filtered.length} entrées</span>
      </div>
      <div className="mt-3 space-y-2">
        {filtered.map((defect) => (
          <div
            key={defect._id}
            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                  KSK {defect.kskNumber}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Zone {defect.section}
                </span>
                <span className="text-xs text-slate-500">
                  {format(defect.createdAt ?? new Date(), "dd/MM HH:mm", { locale: fr })}
                </span>
              </div>
              <span className="text-xs text-slate-500">{defect.agentName}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {defect.defects.map((d) => (
                <span key={d} className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                  {d}
                </span>
              ))}
            </div>
            {defect.comment ? <p className="mt-2 text-xs text-slate-500">{defect.comment}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

