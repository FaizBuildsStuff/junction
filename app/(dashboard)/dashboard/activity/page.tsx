import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import { getUserServiceKeys } from "@/lib/service-keys";

export default async function ActivityPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  const keys = await getUserServiceKeys(user.id);

  return (
    <div>
      <header className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#162C25]/30 mb-2">
          Timeline / Activity
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#162C25] tracking-tighter leading-none">
          Activity.
        </h1>
        <p className="mt-4 text-[#162C25]/50 font-medium max-w-xl">
          Lightweight activity feed based on what the backend knows (e.g., connected services).
        </p>
      </header>

      <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
            <Activity size={18} className="text-[#162C25]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
              Events
            </p>
            <p className="text-lg font-black text-[#162C25]">Recent</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/50">
              Session
            </p>
            <p className="mt-2 text-sm font-bold text-[#162C25]">Logged in</p>
            <p className="mt-1 text-xs font-medium text-[#162C25]/50">
              Cookie session validated on the server.
            </p>
          </div>

          {keys.slice(0, 10).map((k) => (
            <div
              key={k.service_id}
              className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-6"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/50">
                Integration
              </p>
              <p className="mt-2 text-sm font-bold text-[#162C25]">
                Connected {k.service_id}
              </p>
              <p className="mt-1 text-xs font-medium text-[#162C25]/50">
                Saved on {new Date(k.created_at).toLocaleString()}.
              </p>
            </div>
          ))}

          {keys.length === 0 && (
            <p className="text-sm font-medium text-[#162C25]/50">
              No integration events yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

