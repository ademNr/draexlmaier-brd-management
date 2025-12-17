"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Types } from "mongoose";
import { BrdSectionSimulation } from "./brd-section-simulation";
import { DefectHistoryList } from "./defect-history-list";
import { DefectLogDocument } from "@/lib/models/defect-log";

type BrdInfo = {
  _id: string;
  bbNumber: string;
  status: string;
};

type DefectView = DefectLogDocument & { brdId: string | Types.ObjectId; createdAt?: string | Date; updatedAt?: string | Date };

type Props = {
  brd: BrdInfo;
  defects: DefectView[];
};

export function BrdHistoryClient({ brd, defects }: Props) {
  const kskList = useMemo(
    () =>
      Array.from(
        defects
          .reduce((acc, d) => acc.add(d.kskNumber), new Set<string>())
          .values()
      ).sort(),
    [defects]
  );
  const [selectedKsk, setSelectedKsk] = useState<string | undefined>(kskList[0]);
  const [deleting, setDeleting] = useState(false);

  const selectedDefects = useMemo(
    () => (selectedKsk ? defects.filter((d) => d.kskNumber === selectedKsk) : []),
    [defects, selectedKsk]
  );

  const sectionSummary = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, idx) => {
        const section = idx + 1;
        const items = selectedDefects.filter((d) => d.section === section);
        const uniqueDefs = Array.from(new Set(items.flatMap((d) => d.defects)));
        return { id: section, count: items.length, defects: uniqueDefs };
      }),
    [selectedDefects]
  );

  async function handleDeleteKsk() {
    if (!selectedKsk) return;
    if (!confirm(`Supprimer la référence ${selectedKsk} et ses défauts ?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/defects/by-ksk?brdId=${brd._id}&ksk=${selectedKsk}`, { method: "DELETE" });
      if (res.ok) {
        location.reload();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-600">Simulation & historique</p>
          <h1 className="text-2xl font-bold text-slate-900">BB : {brd.bbNumber}</h1>
          <p className="text-sm text-slate-500">Statut {brd.status}</p>
        </div>
        <Link
          href={`/`}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-[1px]"
        >
          Retour dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-x-auto">
        <p className="text-sm font-semibold text-slate-800">Simulation visuelle du BRD</p>
        <p className="text-xs text-slate-500">Vue 6 zones pour la référence KSK sélectionnée</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {kskList.length === 0 ? (
            <span className="text-xs text-slate-500">Aucune référence KSK</span>
          ) : (
            kskList.map((ksk) => (
              <button
                key={ksk}
                type="button"
                onClick={() => setSelectedKsk(ksk)}
                className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 transition ${
                  selectedKsk === ksk
                    ? "bg-emerald-600 text-white ring-emerald-700"
                    : "bg-white text-slate-800 ring-slate-200 hover:ring-emerald-400"
                }`}
              >
                {ksk}
              </button>
            ))
          )}
          {selectedKsk ? (
            <button
              type="button"
              onClick={handleDeleteKsk}
              disabled={deleting}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? "Suppression..." : "Supprimer ce KSK"}
            </button>
          ) : null}
        </div>
        <div className="mt-4">
          <BrdSectionSimulation bbNumber={brd.bbNumber} kskNumber={selectedKsk} sections={sectionSummary} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Historique des défauts</p>
            <p className="text-xs text-slate-500">Filtré par la référence KSK sélectionnée</p>
          </div>
        </div>
        <div className="mt-3">
          <DefectHistoryList defects={defects} kskNumber={selectedKsk} />
        </div>
      </div>
    </div>
  );
}

