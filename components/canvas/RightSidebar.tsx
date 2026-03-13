"use client";

import React from "react";
import { 
  Box, 
  Settings2, 
  Zap, 
  ShieldAlert, 
  Globe, 
  Lock,
  Plus,
  GitCommit,
  CircleDot,
  GitPullRequest,
  PlayCircle,
  Sparkles,
  Clock,
  MessageSquare
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RightSidebar({
  isOpen,
  automationSettings,
  onSettingChange,
  onAddBlock,
}: {
  isOpen: boolean;
  automationSettings: any;
  onSettingChange: (setting: string, value: boolean) => void;
  onAddBlock: (type: string) => void;
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-[#162C25]/5 shadow-[-20px_0_50px_rgba(22,44,37,0.05)] z-[60] transition-transform duration-500 ease-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } flex flex-col p-8`}
    >
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-[#162C25] flex items-center justify-center text-[#C8F064]">
          <Box size={20} />
        </div>
        <h2 className="text-xl font-black text-[#162C25] tracking-tight">Canvas Toolbox</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-12 pr-2">
        {/* Block Library */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#162C25]/40">Block Library</h3>
            <span className="text-[10px] font-bold text-[#C8F064] bg-[#162C25] px-2 py-0.5 rounded">9 Blocks</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <BlockItem icon={<GitCommit size={18} />} label="Commit" onClick={() => onAddBlock("commit")} />
            <BlockItem icon={<CircleDot size={18} />} label="Issue" onClick={() => onAddBlock("issue")} />
            <BlockItem icon={<GitPullRequest size={18} />} label="PR" onClick={() => onAddBlock("pr")} />
            <BlockItem icon={<PlayCircle size={18} />} label="Workflow" onClick={() => onAddBlock("workflow")} />
            <BlockItem icon={<MessageSquare size={18} />} label="Growth Note" onClick={() => onAddBlock("comment")} />
          </div>
        </section>

        {/* Automation Hub */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#162C25]/40 text-left">Automation Hub</h3>
            <Zap size={12} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="space-y-6">
            <AutomationToggle 
              id="auto-push" 
              label="Auto-push on Commit" 
              description="Automatically sync commits to remote."
              checked={automationSettings.autoPush}
              onChange={(v) => onSettingChange("autoPush", v)}
            />
            <AutomationToggle 
              id="issue-check" 
              label="Issue-Gated Deploy" 
              description="Block deployments if critical issues exist."
               checked={automationSettings.issueGated}
              onChange={(v) => onSettingChange("issueGated", v)}
            />
            <AutomationToggle 
              id="real-time-sync" 
              label="Real-time Repo Sync" 
              description="Instant canvas updates on GitHub events."
               checked={automationSettings.realTimeSync}
              onChange={(v) => onSettingChange("realTimeSync", v)}
            />
            <AutomationToggle 
              id="ai-analysis" 
              label="Gemini AI Engineering Brain" 
              description="Analyze architecture and predict failures."
               checked={automationSettings.aiAnalysis}
              onChange={(v) => onSettingChange("aiAnalysis", v)}
            />
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-[#162C25]/5 mt-auto">
        <div className="bg-[#F2F9F1] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#162C25]/5 flex items-center justify-center text-[#162C25]">
                <Settings2 size={16} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-[#162C25]">System Status</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    All Systems Nominal
                </div>
            </div>
        </div>
        <div className="bg-[#162C25] rounded-2xl p-4 mt-3 flex items-center justify-between group cursor-pointer overflow-hidden relative">
            <div className="relative z-10">
                <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Temporal Buffer</p>
                <p className="text-xs font-black text-[#C8F064]">Time Machine Active</p>
            </div>
            <Clock size={16} className="text-[#C8F064] relative z-10 group-hover:rotate-[360deg] transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}

function BlockItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-[#162C25]/5 hover:border-[#162C25]/20 hover:bg-[#F2F9F1] transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-[#F2F9F1] group-hover:bg-white flex items-center justify-center text-[#162C25]/40 group-hover:text-[#162C25] transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/60 group-hover:text-[#162C25]">
        {label}
      </span>
    </button>
  );
}

function AutomationToggle({ id, label, description, checked, onChange }: { id: string, label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-xs font-black text-[#162C25] leading-none cursor-pointer">
          {label}
        </Label>
        <p className="text-[10px] font-medium text-[#162C25]/40 leading-tight">
          {description}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
