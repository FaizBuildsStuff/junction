import { redirect } from "next/navigation";
import { CreditCard, Database } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/service-keys";
import { fetchStripeSummary, formatMoneyMinor } from "@/lib/integrations/stripe";
import { getMockCostsForService, type MockCostSummary } from "@/lib/integrations/mock-costs";
import { fetchLiveIntegrationData } from "@/lib/integrations/live-fetcher";
import StackCostsClient from "./StackCostsClient";

export default async function StackCostsPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  const keys = await getUserServiceKeys(user.id);
  const stripeKey = keys.find((k) => k.service_id === "stripe")?.value_text;
  const stripeSummary = stripeKey ? await fetchStripeSummary(stripeKey).catch(() => null) : null;

  // Process all other connected services (exclude stripe)
  const nonStripeKeys = keys.filter((k) => k.service_id !== "stripe");

  // Try fetching Live data first, fallback to mock data
  const connectedServicesCosts: MockCostSummary[] = await Promise.all(
    nonStripeKeys.map(async (k) => {
      const liveData = await fetchLiveIntegrationData(k.service_id, k.value_text);
      if (liveData) return liveData;
      return getMockCostsForService(k.service_id);
    })
  );

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#162C25]/30 mb-2">
            Finance / Stack Costs
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-[#162C25] tracking-tighter leading-none">
            Stack Costs.
          </h1>
          <p className="mt-4 text-[#162C25]/50 font-medium max-w-xl">
            A unified view of your live integrations. Stripe shows real data; other integrations show realistic simulated metrics.
          </p>
        </div>
      </header>

      {/* STRIPE REAL DATA WIDGET */}
      <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)] mb-12">
        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
              <CreditCard size={18} className="text-[#162C25]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                Stripe
              </p>
              <p className="text-lg font-black text-[#162C25]">Earnings & balances</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-[#162C25] text-[#C8F064]">
            Live Revenue
          </span>
        </div>

        {!stripeSummary ? (
          <div className="rounded-[2rem] bg-[#F2F9F1] border border-[#162C25]/5 p-8">
            <p className="text-sm font-bold text-[#162C25]">Stripe not connected</p>
            <p className="mt-2 text-sm font-medium text-[#162C25]/50">
              Add a Stripe key in Infrastructure to enable this live panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  k: "Available",
                  v: stripeSummary.available[0]
                    ? formatMoneyMinor(
                      stripeSummary.available[0].amount,
                      stripeSummary.available[0].currency
                    )
                    : "—",
                },
                {
                  k: "Pending",
                  v: stripeSummary.pending[0]
                    ? formatMoneyMinor(
                      stripeSummary.pending[0].amount,
                      stripeSummary.pending[0].currency
                    )
                    : "—",
                },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-3xl bg-[#F2F9F1] border border-[#162C25]/5 p-8"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                    {c.k}
                  </p>
                  <p className="mt-4 text-3xl font-black text-[#162C25] truncate tracking-tight">{c.v}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-[#F2F9F1] border border-[#162C25]/5 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                  Recent Income Streams
                </p>
                <div className="space-y-3 mt-4">
                  {stripeSummary.categories.slice(0, 3).map((c) => (
                    <div
                      key={c.category}
                      className="flex items-center justify-between rounded-xl bg-white/50 border border-[#162C25]/5 px-4 py-3"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#162C25]/60">
                        {c.category}
                      </p>
                      <p className="text-sm font-black text-[#162C25]">
                        {formatMoneyMinor(c.amount, c.currency)}
                      </p>
                    </div>
                  ))}
                  {stripeSummary.categories.length === 0 && (
                    <p className="text-sm font-medium text-[#162C25]/50 py-4">No recent history.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SYNTHETIC CONNECTED SERVICES WIDGETS */}
      <h2 className="text-3xl font-black text-[#162C25] tracking-tighter mb-2 flex items-center gap-3">
        <Database className="text-[#162C25]/30" size={28} />
        Integrated Spend
      </h2>
      <p className="text-sm font-medium text-[#162C25]/50 mb-8">
        Simulated cost projections based on your active API keys connected in Infrastructure.
      </p>

      <StackCostsClient mockCosts={connectedServicesCosts} />
    </div>
  );
}

