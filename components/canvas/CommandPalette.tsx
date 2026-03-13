"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Command, 
  Terminal, 
  GitBranch, 
  GitPullRequest, 
  Layout, 
  Clock, 
  Sparkles,
  ChevronRight,
  Zap
} from "lucide-react";

export default function CommandPalette({
  isOpen,
  onClose,
  onAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: "add-issue", label: "Create New Issue Block", icon: <Terminal size={18} />, category: "Actions", shortcut: "I" },
    { id: "add-pr", label: "Create New PR Block", icon: <GitPullRequest size={18} />, category: "Actions", shortcut: "P" },
    { id: "add-workflow", label: "Dispatch Workflow Run", icon: <Zap size={18} />, category: "Automation", shortcut: "W" },
    { id: "layout", label: "Re-organize Canvas Layout", icon: <Layout size={18} />, category: "Views", shortcut: "L" },
    { id: "switch-branch", label: "Switch active repository branch", icon: <GitBranch size={18} />, category: "Git", shortcut: "B" },
    { id: "trigger-ai", label: "Run Architecture AI Analysis", icon: <Sparkles size={18} />, category: "Intelligence", shortcut: "A" },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      if (e.key === "ArrowUp") setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      if (e.key === "Enter") {
        onAction(filteredCommands[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose, onAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-[#162C25]/20 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-[#162C25]/10 shadow-[0_50px_100px_rgba(22,44,37,0.3)] overflow-hidden animate-in slide-in-from-top-4 duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-8 border-b border-[#162C25]/5 bg-white/50">
          <div className="w-12 h-12 rounded-2xl bg-[#162C25] flex items-center justify-center text-[#C8F064] shadow-xl shadow-[#162C25]/20">
            <Command size={24} />
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={20} />
            <input 
              autoFocus
              className="w-full bg-transparent border-none focus:ring-0 text-xl font-black text-[#162C25] placeholder:text-[#162C25]/20 pl-8"
              placeholder="What would you like to build today?"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162C25]/5 border border-[#162C25]/5">
            <span className="text-[10px] font-black uppercase text-[#162C25]/40 opacity-70">Esc to close</span>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredCommands.length > 0 ? (
            <div className="space-y-6 p-4">
              {["Actions", "Git", "Automation", "Intelligence", "Views"].map(category => {
                const categoryCmds = filteredCommands.filter(c => c.category === category);
                if (categoryCmds.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#162C25]/30 ml-2">{category}</h3>
                    {categoryCmds.map(cmd => {
                      const isSelected = filteredCommands[selectedIndex]?.id === cmd.id;
                      return (
                        <div
                          key={cmd.id}
                          className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                            isSelected ? "bg-[#162C25] text-white shadow-2xl scale-[1.02]" : "hover:bg-[#F2F9F1] text-[#162C25]"
                          }`}
                          onMouseEnter={() => setSelectedIndex(filteredCommands.indexOf(cmd))}
                          onClick={() => {
                            onAction(cmd.id);
                            onClose();
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/10" : "bg-[#F2F9F1]"}`}>
                              {cmd.icon}
                            </div>
                            <div>
                                <p className="text-sm font-black">{cmd.label}</p>
                                <p className={`text-[10px] font-medium opacity-50 ${isSelected ? "text-white" : "text-[#162C25]"}`}>Trigger operation across the canvas ecosystem</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             {isSelected && <ChevronRight size={18} className="animate-pulse text-[#C8F064]" />}
                             <div className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${isSelected ? "border-white/20 bg-white/5" : "border-[#162C25]/10 bg-white"}`}>
                                {cmd.shortcut}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-[2.5rem] bg-[#F2F9F1] flex items-center justify-center mx-auto text-[#162C25]/20">
                    <Search size={40} />
                </div>
                <div>
                   <p className="text-lg font-black text-[#162C25]">No system commands found</p>
                   <p className="text-sm font-medium text-[#162C25]/40 mt-1">Try searching for 'PR', 'Issue', or 'AI'</p>
                </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#F2F9F1]/50 border-t border-[#162C25]/5 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <kbd className="px-2 py-1 rounded bg-white border border-[#162C25]/10 text-[10px] font-black text-[#162C25]">ENTER</kbd>
                 <span className="text-[10px] font-bold text-[#162C25]/40 uppercase tracking-widest">Select</span>
              </div>
              <div className="flex items-center gap-2">
                 <kbd className="px-2 py-1 rounded bg-white border border-[#162C25]/10 text-[10px] font-black text-[#162C25]">↑↓</kbd>
                 <span className="text-[10px] font-bold text-[#162C25]/40 uppercase tracking-widest">Navigate</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-[#162C25]/60">
              <Sparkles size={14} className="text-[#C8F064] fill-[#C8F064]" />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Assisted Control</span>
           </div>
        </div>
      </div>
    </div>
  );
}
