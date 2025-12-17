import { notFound } from "next/navigation";
import { BrdClient } from "@/components/brd-client";
import { getBrdDetail } from "@/lib/data";

export const dynamic = "force-dynamic";

type ParamsPromise = { params: Promise<{ id: string }> };

export default async function BrdPage({ params }: ParamsPromise) {
  const resolved = await params;
  const detail = await getBrdDetail(resolved.id);
  if (!detail) return notFound();

  const defects = detail.defects.map((d) => ({
    ...d,
    brdId: detail.brd._id,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : "",
  }));

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl px-2 sm:px-0">
        <div className="mb-4 flex justify-end">
          <a
            href={`/brd/${detail.brd._id}/history`}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-[1px]"
          >
            Simulation & historique
          </a>
        </div>
        <BrdClient brd={detail.brd} defects={defects as any} />
      </div>
    </main>
  );
}

