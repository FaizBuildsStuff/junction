import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Globe2, Mail, Zap } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/service-keys";
import { fetchStripeSummary, formatMoneyMinor } from "@/lib/integrations/stripe";

export default async function DashboardPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  const serviceKeys = await getUserServiceKeys(user.id);
  const connectedServices = serviceKeys.map((k) => k.service_id);

  const stripeKey = serviceKeys.find((k) => k.service_id === "stripe")?.value_text;
  const stripeSummary = stripeKey ? await fetchStripeSummary(stripeKey).catch(() => null) : null;

  return (
    <div>
        {/* TOP GREETING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#162C25]/30 mb-2">System Terminal / v.2.0.1</p>
            <h1 className="text-4xl md:text-6xl font-black text-[#162C25] tracking-tighter leading-none">
                Command Hub.
            </h1>
          </div>
          <Link 
            href="/" 
            className="px-8 py-4 bg-white border border-[#162C25]/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#162C25] hover:text-white transition-all shadow-sm"
          >
            Live Website <ArrowUpRight size={14} className="inline ml-1" />
          </Link>
        </header>

        {/* BENTO GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* USER CARD */}
          <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-[#162C25]/5 shadow-[0_20px_50px_rgba(22,44,37,0.04)] relative overflow-hidden group">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#C8F064]/20 rounded-full blur-3xl group-hover:bg-[#C8F064]/40 transition-all duration-700" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30 mb-6">Identity Profile</p>
             <h2 className="text-4xl font-black text-[#162C25] mb-2 uppercase tracking-tighter italic">@{user.username}</h2>
             <p className="text-[#162C25]/50 font-medium max-w-sm">Node identifier established. Your session is currently encrypted via 256-bit AES protocol.</p>
          </div>

          {/* STATUS CARD */}
          <div className="bg-[#162C25] p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8F064]/40">Network Status</p>
             <div className="my-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#C8F064] animate-pulse" />
                    <span className="text-white font-black uppercase text-xs tracking-widest">Active Session</span>
                </div>
                <p className="text-white/40 text-[10px] font-medium leading-relaxed">
                  {connectedServices.length > 0
                    ? `Detected ${connectedServices.length} connected services.`
                    : "No services connected yet. Add keys during signup."}
                </p>
             </div>
             <Link
               href="/dashboard/stack-costs"
               className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-[#C8F064] hover:text-[#162C25] transition-all text-center"
             >
               View Stack Costs
             </Link>
          </div>

          {/* DATA CARDS */}
          {[
            { label: "Internal UID", value: user.id.slice(0, 12) + "...", icon: Zap },
            { label: "Registered Email", value: user.email, icon: Mail },
            { label: "Deployment", value: "Neon / Postgres", icon: Globe2 },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#162C25]/5 hover:scale-[1.02] transition-transform">
               <div className="w-10 h-10 bg-[#F2F9F1] rounded-xl flex items-center justify-center mb-6">
                 <item.icon size={18} className="text-[#162C25]" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30 mb-2">{item.label}</p>
               <p className="text-lg font-black text-[#162C25] truncate">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-black text-[#162C25] tracking-tighter">
                Connected Services
              </h3>
              <p className="text-sm font-medium text-[#162C25]/50 mt-1">
                Compact snapshot. Full breakdown lives in Stack Costs.
              </p>
            </div>
            <Link
              href="/dashboard/stack-costs"
              className="text-[10px] font-black text-[#C8F064] bg-[#162C25] px-4 py-2 rounded-full uppercase tracking-widest w-fit"
            >
              Open Stack Costs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[2rem] bg-[#F2F9F1] border border-[#162C25]/5 p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                Services Connected
              </p>
              <p className="mt-3 text-4xl font-black tracking-tight text-[#162C25]">
                {connectedServices.length}
              </p>
              <p className="mt-2 text-xs font-medium text-[#162C25]/50">
                {connectedServices.slice(0, 4).join(", ") || "None"}
                {connectedServices.length > 4 ? "…" : ""}
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#F2F9F1] border border-[#162C25]/5 p-6 md:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                Stripe Snapshot
              </p>

              {!stripeSummary ? (
                <div className="mt-3">
                  <p className="text-sm font-bold text-[#162C25]">Not connected</p>
                  <p className="text-xs font-medium text-[#162C25]/50 mt-1">
                    Add a Stripe key during signup to pull balances and earnings categories.
                  </p>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white border border-[#162C25]/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/30">
                      Available
                    </p>
                    <p className="mt-2 text-lg font-black text-[#162C25]">
                      {stripeSummary.available[0]
                        ? formatMoneyMinor(
                            stripeSummary.available[0].amount,
                            stripeSummary.available[0].currency
                          )
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white border border-[#162C25]/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/30">
                      Pending
                    </p>
                    <p className="mt-2 text-lg font-black text-[#162C25]">
                      {stripeSummary.pending[0]
                        ? formatMoneyMinor(
                            stripeSummary.pending[0].amount,
                            stripeSummary.pending[0].currency
                          )
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white border border-[#162C25]/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/30">
                      Last Earned
                    </p>
                    <p className="mt-2 text-lg font-black text-[#162C25]">
                      {stripeSummary.lastEarnedAt
                        ? new Date(stripeSummary.lastEarnedAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}