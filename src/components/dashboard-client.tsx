"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalyticsSummary, BrdCard as BrdCardType } from "@/lib/data";
import { BrdCard } from "./brd-card";
import { NewBrdForm } from "./new-brd-form";
import { AnalyticsZoneType } from "./analytics-zone-type";
import { AnalyticsTimeType } from "./analytics-time-type";

type Props = {
  initialCards: BrdCardType[];
  initialAnalytics?: AnalyticsSummary;
};

export function DashboardClient({ initialCards, initialAnalytics }: Props) {
  const [cards, setCards] = useState<BrdCardType[]>(initialCards);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | undefined>(initialAnalytics);
  const [loading, setLoading] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [brdRes, analyticsRes] = await Promise.all([fetch("/api/brds"), fetch("/api/analytics/summary")]);
      if (brdRes.ok) {
        const data = await brdRes.json();
        setCards(data.data);
      }
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 px-3 pb-6 sm:px-4 transition-[padding] duration-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 max-w-[80%] transform bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-200 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-72`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-emerald-700">BRD Pilotage</span>
          </div>
          <button
            className="rounded-full px-2 py-1 text-xs font-semibold text-slate-600 md:hidden"
            onClick={() => setNavOpen(false)}
          >
            Fermer
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4 text-sm font-semibold text-slate-700">
          <a
            href="#brd-section"
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-emerald-50"
            onClick={() => setNavOpen(false)}
          >
            <span className="text-emerald-600">📦</span> BRD
          </a>
          <a
            href="#analytics-section"
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-emerald-50"
            onClick={() => setNavOpen(false)}
          >
            <span className="text-emerald-600">📊</span> Analytics
          </a>
          <button
            onClick={() => {
              refresh();
              setNavOpen(false);
            }}
            className="mt-2 rounded-lg bg-emerald-600 px-3 py-2 text-left text-white transition hover:bg-emerald-700"
          >
            {loading ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {navOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setNavOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Fermer navigation"
        />
      ) : null}

      <header className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white shadow-lg sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-100">Pilotage qualité</p>
            <h1 className="text-2xl font-bold">Visual Management & Reclamations internes</h1>
            <p className="text-sm text-emerald-100">Suivi temps réel des BRD / KSK sur tablette</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-left shadow-lg backdrop-blur">
              <p className="text-xs text-emerald-100">BRD actifs</p>
              <p className="text-2xl font-bold">{cards.length}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={refresh}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow hover:translate-y-[1px]"
          >
            {loading ? "Actualisation..." : "Actualiser"}
          </button>
          <Link
            href="#brd-section"
            className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            BRD
          </Link>
          <Link
            href="#analytics-section"
            className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Analytics
          </Link>
          <button
            className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 md:hidden"
            onClick={() => setNavOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <NewBrdForm onCreated={refresh} />

      <section id="brd-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">BRD en cours</h2>
          <p className="text-xs text-slate-500">Sélectionnez un BRD pour saisir un nouveau KSK</p>
        </div>
        {cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Aucun BRD pour l’instant. Ajoutez-en un pour commencer.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {cards.map((card) => (
              <BrdCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>

      {analytics ? (
        <section id="analytics-section" className="space-y-3 scroll-mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Tableau de bord défauts</h3>
            <span className="text-xs text-slate-500">Zones, types et chronologie</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <AnalyticsZoneType data={analytics.perSectionType} />
            <AnalyticsTimeType initial={analytics.timeSeriesByType} />
          </div>
        </section>
      ) : null}

    </div>
  );
}

