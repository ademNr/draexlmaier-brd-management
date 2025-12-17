"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BrdCard as BrdCardType } from "@/lib/data";
import { SectionGrid } from "./section-grid";

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "cloturee"
      ? "bg-emerald-100 text-emerald-700"
      : status === "en cours"
        ? "bg-amber-100 text-amber-700"
        : "bg-sky-100 text-sky-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}

export function BrdCard({ card }: { card: BrdCardType }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  function openCard() {
    router.push(`/brd/${card.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCard();
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Supprimer ce BRD ?")) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/brds/${encodeURIComponent(card.id)}`, { method: "DELETE", cache: "no-store" });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Suppression impossible (${res.status}) ${msg}`);
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("delete brd", err);
      alert("Erreur réseau lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openCard}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 md:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow">
            BRD : {card.bbNumber}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={card.status} />
          <span className="text-xs text-slate-500">
            MAJ : {card.lastUpdate ? format(new Date(card.lastUpdate), "dd/MM HH:mm", { locale: fr }) : "n/a"}
          </span>
          <button
            onClick={handleDelete}
            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
          <Link
            onClick={(e) => e.stopPropagation()}
            href={`/brd/${card.id}/history`}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Simulation & histo
          </Link>
        </div>
      </div>

      <SectionGrid
        cells={card.sections.map((s) => ({
          id: s.id,
          count: s.count,
        }))}
        title="Disposition physique (6 sections)"
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
          Défauts : {card.totalDefects}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          {card.ksks.slice(0, 4).map((ksk) => (
            <span key={ksk} className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-200">
              KSK {ksk}
            </span>
          ))}
          {card.ksks.length > 4 ? <span className="text-xs text-slate-500">+ {card.ksks.length - 4} autres</span> : null}
        </div>
      </div>
    </div>
  );
}

