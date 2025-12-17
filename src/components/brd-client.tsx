"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Types } from "mongoose";
import { DefectForm } from "./defect-form";
import { DefectLogDocument } from "@/lib/models/defect-log";

type BrdInfo = {
  _id: string;
  bbNumber: string;
  status: string;
  line?: string;
};

type DefectView = DefectLogDocument & { brdId: string | Types.ObjectId; createdAt?: string | Date; updatedAt?: string | Date };

type Props = {
  brd: BrdInfo;
  defects: DefectView[];
};

export function BrdClient({ brd, defects: initialDefects }: Props) {
  const [, setDefects] = useState<DefectView[]>(initialDefects);
  const [loading, setLoading] = useState(false);
  const [, setDraft] = useState<{ ksk?: string; sections: Record<number, string[]> }>({
    ksk: undefined,
    sections: {},
  });

  async function refreshDetail() {
    setLoading(true);
    try {
      const res = await fetch(`/api/brds/${brd._id}`);
      if (res.ok) {
        const json = await res.json();
        setDefects(json.data.defects);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDraftChange = useCallback((nextDraft: { ksk?: string; sections: Record<number, string[]> }) => {
    setDraft(nextDraft);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-600">BRD actif</p>
          <h1 className="text-2xl font-bold text-slate-900">BB : {brd.bbNumber}</h1>
          <p className="text-sm text-slate-500">Statut {brd.status}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-[1px]"
          >
            Retour dashboard
          </Link>
          {loading ? <span className="text-xs text-slate-500">Maj...</span> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? <span className="text-xs text-slate-500">Mise à jour...</span> : null}
        <DefectForm brdId={brd._id} onSaved={() => refreshDetail()} onDraftChange={handleDraftChange} />
      </div>
    </div>
  );
}

