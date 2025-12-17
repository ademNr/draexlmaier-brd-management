"use client";

import { useState } from "react";

type Props = { onCreated?: () => void };

export function NewBrdForm({ onCreated }: Props) {
  const [bbNumber, setBbNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/brds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bbNumber, description }),
      });
      if (!res.ok) {
        throw new Error("Impossible de créer le BRD");
      }
      setBbNumber("");
      setDescription("");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4 shadow-inner"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-emerald-800">Nouveau BRD</p>
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          BB (unique)
          <input
            required
            value={bbNumber}
            onChange={(e) => setBbNumber(e.target.value)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
            placeholder="BB-002"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700 md:col-span-2">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-400 focus:ring-2"
            placeholder="Faisceau tableau de bord"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Création..." : "Ajouter le BRD"}
        </button>
      </div>
    </form>
  );
}

