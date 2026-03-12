import { redirect } from "next/navigation";
import { CreditCard, KeyRound } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys, maskSecret } from "@/lib/service-keys";
import { fetchStripeSummary, formatMoneyMinor } from "@/lib/integrations/stripe";

export default async function StackCostsPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  const keys = await getUserServiceKeys(user.id);
  const stripeKey = keys.find((k) => k.service_id === "stripe")?.value_text;
  const stripeSummary = stripeKey ? await fetchStripeSummary(stripeKey).catch(() => null) : null;

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
            Uses your saved service keys to fetch a live snapshot. Keys are stored in Neon and never
            exposed back to the browser.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)]">
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
              Live
            </span>
          </div>

          {!stripeSummary ? (
            <div className="rounded-[2rem] bg-[#F2F9F1] border border-[#162C25]/5 p-8">
              <p className="text-sm font-bold text-[#162C25]">Stripe not connected</p>
              <p className="mt-2 text-sm font-medium text-[#162C25]/50">
                Add a Stripe key during signup to enable this panel.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
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
                  {
                    k: "Account",
                    v: stripeSummary.businessName ?? stripeSummary.accountId ?? "—",
                  },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-5"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                      {c.k}
                    </p>
                    <p className="mt-2 text-lg font-black text-[#162C25] truncate">{c.v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] bg-[#F2F9F1] border border-[#162C25]/5 p-6">
                <div className="flex items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                      Earnings categories (net)
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#162C25]/50">
                      Summed from recent Stripe balance transactions.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/30">
                      Window
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#162C25]">
                      {stripeSummary.firstEarnedAt
                        ? `${new Date(stripeSummary.firstEarnedAt).toLocaleDateString()} → ${new Date(
                            stripeSummary.lastEarnedAt ?? stripeSummary.firstEarnedAt
                          ).toLocaleDateString()}`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {stripeSummary.categories.slice(0, 10).map((c) => (
                    <div
                      key={c.category}
                      className="flex items-center justify-between rounded-2xl bg-white border border-[#162C25]/5 px-5 py-4"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/50">
                        {c.category}
                      </p>
                      <p className="text-sm font-black text-[#162C25]">
                        {formatMoneyMinor(c.amount, c.currency)}
                      </p>
                    </div>
                  ))}
                  {stripeSummary.categories.length === 0 && (
                    <p className="text-sm font-medium text-[#162C25]/50">No data.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
              <KeyRound size={18} className="text-[#162C25]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                Connected
              </p>
              <p className="text-lg font-black text-[#162C25]">Service keys</p>
            </div>
          </div>

          <div className="space-y-3">
            {keys.map((k) => (
              <div
                key={k.service_id}
                className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]">
                    {k.service_id}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/40">
                    {new Date(k.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-xs font-mono text-[#162C25]/60 break-all">
                  {maskSecret(k.value_text)}
                </p>
              </div>
            ))}
            {keys.length === 0 && (
              <p className="text-sm font-medium text-[#162C25]/50">
                No service keys saved for this user.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

