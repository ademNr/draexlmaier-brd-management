import { DashboardClient } from "@/components/dashboard-client";
import { getAnalyticsSummary, getBrdCards } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cards, analytics] = await Promise.all([getBrdCards(), getAnalyticsSummary()]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <DashboardClient initialCards={cards} initialAnalytics={analytics} />
      </div>
    </main>
  );
}
