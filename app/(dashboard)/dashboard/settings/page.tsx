import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { getUserFromRequestSession } from "@/lib/auth";
import SettingsProfileClient from "./SettingsProfileClient";

export default async function SettingsPage() {
  const user = await getUserFromRequestSession();
  if (!user) redirect("/signin");

  return (
    <div>
      <header className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#162C25]/30 mb-2">
          Preferences / Settings
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#162C25] tracking-tighter leading-none">
          Settings.
        </h1>
        <p className="mt-4 text-[#162C25]/50 font-medium max-w-xl">
          Account settings can live here (password reset, connected services management, etc.).
        </p>
      </header>

      <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
            <Settings size={18} className="text-[#162C25]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
              Signed in as
            </p>
            <p className="text-lg font-black text-[#162C25]">@{user.username}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/50">
            Email
          </p>
          <p className="mt-2 text-sm font-black text-[#162C25]">{user.email}</p>
        </div>
      </div>

      <SettingsProfileClient
        initialUsername={user.username}
        initialEmail={user.email}
      />
    </div>
  );
}

