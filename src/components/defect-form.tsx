"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFECT_TYPES, SHIFT_OPTIONS } from "@/lib/constants";
import { SectionGrid } from "./section-grid";

type Props = {
  brdId: string;
  onSaved?: () => void;
  onDraftChange?: (draft: { ksk?: string; sections: SectionSelections }) => void;
};

type SectionSelections = Record<number, string[]>;

export function DefectForm({ brdId, onSaved, onDraftChange }: Props) {
  const router = useRouter();
  const [kskNumber, setKskNumber] = useState("");
  const [agentName, setAgentName] = useState("");
  const [shift, setShift] = useState(SHIFT_OPTIONS[0]);
  const [comment, setComment] = useState("");
  const [selectedSection, setSelectedSection] = useState(1);
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const [sectionSelections, setSectionSelections] = useState<SectionSelections>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    onDraftChange?.({ ksk: kskNumber, sections: sectionSelections });
  }, [kskNumber, sectionSelections, onDraftChange]);

  function toggleDefect(defect: string) {
    setSelectedDefects((current) => {
      const next = current.includes(defect) ? current.filter((d) => d !== defect) : [...current, defect];
      setSectionSelections((prev) => ({ ...prev, [selectedSection]: next }));
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!kskNumber) {
      setMessage("Saisissez la référence KSK avant de continuer");
      return;
    }
    const payloadSections: SectionSelections = {
      ...sectionSelections,
      [selectedSection]: selectedDefects,
    };
    const entries = Object.entries(payloadSections).filter(([, defs]) => defs.length > 0);
    if (entries.length === 0) {
      setMessage("Ajoutez au moins un défaut dans une zone");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const responses = await Promise.all(
        entries.map(([sectionStr, defects]) =>
          fetch("/api/defects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              brdId,
              kskNumber,
              section: Number(sectionStr),
              defects,
              agentName,
              shift,
              comment,
              role: "agent",
            }),
          })
        )
      );

      const failed = responses.find((r) => !r.ok);
      if (failed) throw new Error("Impossible d'enregistrer un ou plusieurs défauts");

      setSectionSelections((prev) => ({ ...prev, [selectedSection]: selectedDefects }));
      setMessage("Défauts enregistrés ✔︎");
      setSelectedDefects([]);
      setSectionSelections({});
      router.refresh();
      onSaved?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  const defectGrid = useMemo(
    () =>
      DEFECT_TYPES.map((defect) => ({
        label: defect,
        value: defect,
      })),
    []
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Saisie KSK</p>
          <p className="text-xs text-slate-500">BB saisi une fois, KSK saisi par pièce contrôlée</p>
        </div>
        {message ? <span className="text-xs font-semibold text-emerald-600">{message}</span> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          Référence KSK
          <input
            required
            value={kskNumber}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setKskNumber(value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-3 text-lg font-semibold uppercase tracking-wide outline-none ring-emerald-400 focus:ring-2"
            placeholder="KSK19001"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            Agent Qualité
            <input
              required
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
              placeholder="Nom & prénom"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            Shift
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
            >
              {SHIFT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            Commentaire
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
              placeholder="Observations..."
            />
          </label>
        </div>
      </div>

      <SectionGrid
        title="Choix de la zone (6 sections physiques)"
        cells={Array.from({ length: 6 }).map((_, idx) => ({
          id: idx + 1,
          selected: selectedSection === idx + 1,
          onSelect: (id) => {
            // sauvegarde l'état de la zone en cours
            setSectionSelections((prev) => ({ ...prev, [selectedSection]: selectedDefects }));
            setSelectedSection(id);
            setSelectedDefects(sectionSelections[id] ?? []);
          },
          count: sectionSelections[idx + 1]?.length ?? 0,
          label:
            sectionSelections[idx + 1] && sectionSelections[idx + 1].length
              ? sectionSelections[idx + 1].join(", ")
              : undefined,
        }))}
      />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase text-slate-500">Défauts constatés</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {defectGrid.map((defect) => {
            const isActive = selectedDefects.includes(defect.value);
            return (
              <button
                type="button"
                key={defect.value}
                onClick={() => toggleDefect(defect.value)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {defect.label}
                <span className="text-xs">{isActive ? "✔︎" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || selectedDefects.length === 0 || !kskNumber}
          className="rounded-2xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Confirmer l'entrée"}
        </button>
      </div>
    </form>
  );
}

