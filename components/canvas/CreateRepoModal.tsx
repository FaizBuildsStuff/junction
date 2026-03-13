"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  X, 
  Github, 
  Loader2, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check,
  Globe,
  Lock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGitHubRepo } from "@/app/actions/github";
import { useRouter } from "next/navigation";

export default function CreateRepoModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newRepo, setNewRepo] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const repo = await createGitHubRepo(formData.name, formData.description, formData.isPrivate);
      setNewRepo(repo);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setupCommands = newRepo ? [
    `git init`,
    `git remote add origin ${newRepo.html_url}.git`,
    `git add .`,
    `git commit -m "initial commit"`,
    `git push -u origin main`
  ] : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#162C25]/60 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] border border-[#162C25]/5 shadow-[0_40px_100px_rgba(22,44,37,0.3)] z-[101] overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="p-8 border-b border-[#162C25]/5 flex items-center justify-between bg-[#F2F9F1]/30">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#162C25] flex items-center justify-center text-[#C8F064]">
                  <Github size={24} />
               </div>
               <div>
                  <Dialog.Title className="text-2xl font-black text-[#162C25] tracking-tight">
                    {step === 1 ? "Create Repository" : "Setup Instructions"}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs font-bold text-[#162C25]/40 uppercase tracking-widest">
                    {step === 1 ? "Start a new project on GitHub" : "Connect your local code"}
                  </Dialog.Description>
               </div>
            </div>
            <Dialog.Close asChild>
              <button className="w-10 h-10 rounded-full hover:bg-[#162C25]/5 flex items-center justify-center text-[#162C25]/20 hover:text-[#162C25] transition-all">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-10">
            {step === 1 ? (
              <form onSubmit={handleCreate} className="space-y-8">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest">
                    {error}
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Repository Name</Label>
                  <Input 
                    required 
                    placeholder="my-awesome-project" 
                     className="h-16 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 text-lg font-bold"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Description (Optional)</Label>
                  <Input 
                    placeholder="What is this project about?" 
                    className="h-16 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 font-medium"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <VisibilityOption 
                    active={!formData.isPrivate} 
                    icon={<Globe size={20} />} 
                    title="Public" 
                    desc="Anyone can see it" 
                    onClick={() => setFormData({...formData, isPrivate: false})} 
                   />
                   <VisibilityOption 
                    active={formData.isPrivate} 
                    icon={<Lock size={20} />} 
                    title="Private" 
                    desc="Only you can see it" 
                    onClick={() => setFormData({...formData, isPrivate: true})} 
                   />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-[2rem] bg-[#162C25] text-[#C8F064] text-lg font-black tracking-tight hover:shadow-2xl hover:shadow-[#162C25]/20 transition-all uppercase"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Create & Initialization"}
                </Button>
              </form>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center gap-4 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                      <CheckCircle2 size={24} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-[#162C25]">Repository Created!</p>
                      <p className="text-xs font-medium text-emerald-700">{newRepo.full_name}</p>
                   </div>
                </div>

                <div className="space-y-4 text-left">
                  <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#162C25]/40">
                    <Terminal size={14} /> Quick Setup
                  </h4>
                  <div className="bg-[#162C25] rounded-[2rem] p-6 space-y-3 shadow-xl">
                     {setupCommands.map((cmd, i) => (
                       <div key={i} className="group flex items-center justify-between text-white/90 font-mono text-xs">
                         <code className="bg-white/5 px-3 py-2 rounded-lg break-all">{cmd}</code>
                         <button onClick={() => copyCommand(cmd)} className="text-white/20 hover:text-[#C8F064] transition-colors">
                           {copied ? <Check size={14} /> : <Copy size={14} />}
                         </button>
                       </div>
                     ))}
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/dashboard/canvas/${newRepo.owner.login}/${newRepo.name}`);
                  }}
                  className="w-full h-16 rounded-[2rem] bg-[#C8F064] text-[#162C25] text-lg font-black tracking-tight hover:shadow-2xl hover:shadow-[#C8F064]/20 transition-all uppercase flex items-center justify-center gap-3"
                >
                  Go to Canvas <ArrowRight size={20} />
                </Button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function VisibilityOption({ active, icon, title, desc, onClick }: { active: boolean, icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-3 text-left ${
        active ? 'bg-[#162C25] border-[#162C25] text-white' : 'bg-white border-[#162C25]/5 text-[#162C25] hover:bg-[#F2F9F1]'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-[#C8F064] text-[#162C25]' : 'bg-[#F2F9F1]'}`}>
        {icon}
      </div>
      <div>
        <p className="font-black text-sm">{title}</p>
        <p className={`text-[10px] font-bold ${active ? 'text-white/40' : 'text-[#162C25]/40'}`}>{desc}</p>
      </div>
    </button>
  );
}
