import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/service-keys";

export default async function InfrastructurePage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  const keys = await getUserServiceKeys(user.id);
  const hasNeon = keys.some((k) => k.service_id === "neon");

  return (
    <div>
      <header className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#162C25]/30 mb-2">
          Ops / Infrastructure
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#162C25] tracking-tighter leading-none">
          Infrastructure.
        </h1>
        <p className="mt-4 text-[#162C25]/50 font-medium max-w-xl">
          This page is wired to your stored service keys and can be expanded to pull real infra
          metrics (AWS/GCP/Vercel/etc).
        </p>
      </header>

      <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
            <Database size={18} className="text-[#162C25]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
              Status
            </p>
            <p className="text-lg font-black text-[#162C25]">Connections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { k: "Neon DB key stored", v: hasNeon ? "Yes" : "No" },
            { k: "Services stored", v: String(keys.length) },
            { k: "Region", v: "Auto" },
          ].map((c) => (
            <div
              key={c.k}
              className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                {c.k}
              </p>
              <p className="mt-2 text-xl font-black text-[#162C25]">{c.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

