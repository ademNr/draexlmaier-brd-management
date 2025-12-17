import { notFound } from "next/navigation";
import { BrdHistoryClient } from "@/components/brd-history-client";
import { getBrdDetail } from "@/lib/data";

export const dynamic = "force-dynamic";

type ParamsPromise = { params: Promise<{ id: string }> };
type DefectView = {
  brdId: string;
  kskNumber: string;
  section: number;
  defects: string[];
  role: string;
  status: string;
  comment?: string | null;
  shift?: string;
  agentName?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  _id: string;
};

export default async function BrdHistoryPage({ params }: ParamsPromise) {
  const resolved = await params;
  const detail = await getBrdDetail(resolved.id);
  if (!detail) return notFound();

  const defects: DefectView[] = detail.defects.map((d) => {
    const base = d as unknown as DefectView;
    return {
      ...base,
      brdId: String(detail.brd._id),
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : "",
    } as DefectView;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <BrdHistoryClient brd={detail.brd} defects={defects as any} />
      </div>
    </main>
  );
}

