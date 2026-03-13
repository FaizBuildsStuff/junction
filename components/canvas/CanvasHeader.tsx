"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Plus, 
  Github, 
  Search, 
  ArrowLeft,
  LayoutDashboard,
  GitBranch,
  Terminal
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getGitHubRepos } from "@/app/actions/github";

export default function CanvasHeader({
  owner,
  repo,
  onOpenCreateModal,
}: {
  owner: string;
  repo: string;
  onOpenCreateModal: () => void;
}) {
  const router = useRouter();
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const data = await getGitHubRepos();
      setRepos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-2xl p-3 px-6 rounded-[2rem] border border-[#162C25]/5 shadow-[0_10px_40px_rgba(22,44,37,0.05)] w-fit max-w-2xl">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => router.push("/dashboard/stack-costs")}
        className="rounded-full hover:bg-[#162C25]/5 text-[#162C25]/40 hover:text-[#162C25]"
      >
        <ArrowLeft size={18} />
      </Button>

      <div className="h-8 w-px bg-[#162C25]/5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-4 group px-2 py-1 rounded-xl hover:bg-[#F2F9F1] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-[#162C25] flex items-center justify-center text-[#C8F064]">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h1 className="text-sm font-black text-[#162C25] tracking-tight">{repo}</h1>
                 <ChevronDown size={14} className="text-[#162C25]/20 group-hover:text-[#162C25] transition-colors" />
              </div>
              <p className="text-[10px] font-bold text-[#162C25]/40 uppercase tracking-widest">{owner}</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[280px] p-2 rounded-2xl border border-[#162C25]/10 shadow-2xl bg-white/95 backdrop-blur-xl">
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#162C25]/40">Switch Repository</div>
          <div className="max-h-[300px] overflow-y-auto py-1">
             {repos.map(r => (
               <DropdownMenuItem 
                key={r.id} 
                onClick={() => router.push(`/dashboard/canvas/${r.owner.login}/${r.name}`)}
                className={`rounded-xl px-3 py-2.5 cursor-pointer focus:bg-[#F2F9F1] group ${r.name === repo ? 'bg-[#F2F9F1]' : ''}`}
               >
                 <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#162C25]/5 flex items-center justify-center text-[#162C25]/40 group-focus:text-[#162C25]">
                        <Github size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#162C25] truncate">{r.name}</p>
                        <p className="text-[9px] font-medium text-[#162C25]/40">{r.owner.login}</p>
                    </div>
                 </div>
               </DropdownMenuItem>
             ))}
          </div>
          <DropdownMenuSeparator className="bg-[#162C25]/5" />
          <DropdownMenuItem 
            onClick={onOpenCreateModal}
            className="rounded-xl px-3 py-3 cursor-pointer focus:bg-[#162C25] focus:text-[#C8F064] text-[#162C25] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 mt-1"
          >
            <Plus size={16} /> Create New Repository
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-8 w-px bg-[#162C25]/5" />

      <div className="flex items-center gap-4 px-2">
         <HeaderMetric icon={<GitBranch size={14} />} label="main" />
         <HeaderMetric icon={<Terminal size={14} />} label="Active" color="text-emerald-600" />
      </div>
    </div>
  );
}

function HeaderMetric({ icon, label, color = "text-[#162C25]/40" }: { icon: React.ReactNode; label: string; color?: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={color}>{icon}</span>
            <span className="text-[10px] font-bold text-[#162C25]">{label}</span>
        </div>
    )
}
