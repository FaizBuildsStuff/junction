"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  X, 
  GitPullRequest, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  GitBranch,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGitHubPR, getGitHubBranches } from "@/app/actions/github";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function CreatePRModal({
  isOpen,
  onOpenChange,
  owner,
  repo,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  owner: string;
  repo: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    head: "",
    base: "main",
  });

  useEffect(() => {
    if (isOpen) {
        loadBranches();
    }
  }, [isOpen]);

  const loadBranches = async () => {
    try {
        const data = await getGitHubBranches(owner, repo);
        setBranches(data);
        if (data.length > 0 && !formData.head) {
            setFormData(prev => ({ ...prev, head: data[0].name }));
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createGitHubPR(owner, repo, formData.title, formData.head, formData.base, formData.body);
      setStep(2);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep(1);
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#162C25]/60 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] border border-[#162C25]/5 shadow-[0_40px_100px_rgba(22,44,37,0.3)] z-[101] overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="p-8 border-b border-[#162C25]/5 flex items-center justify-between bg-blue-50/30">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#162C25] flex items-center justify-center text-blue-400">
                  <GitPullRequest size={24} />
               </div>
               <div>
                  <Dialog.Title className="text-2xl font-black text-[#162C25] tracking-tight">
                    {step === 1 ? "New PR Block" : "PR Created"}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs font-bold text-[#162C25]/40 uppercase tracking-widest">
                    {step === 1 ? `Merge changes in ${repo}` : "Syncing with canvas..."}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-5 gap-3 items-center">
                    <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Head</Label>
                        <Select value={formData.head} onValueChange={(v) => setFormData({...formData, head: v})}>
                            <SelectTrigger className="h-12 rounded-xl bg-[#F2F9F1] border-none font-bold">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#162C25]/10 shadow-xl">
                                {branches.map(b => (
                                    <SelectItem key={b.name} value={b.name} className="rounded-lg font-bold">{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-center pt-6">
                        <ArrowRightLeft size={16} className="text-[#162C25]/20" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Base</Label>
                        <Select value={formData.base} onValueChange={(v) => setFormData({...formData, base: v})}>
                            <SelectTrigger className="h-12 rounded-xl bg-[#F2F9F1] border-none font-bold">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#162C25]/10 shadow-xl">
                                {branches.map(b => (
                                    <SelectItem key={b.name} value={b.name} className="rounded-lg font-bold">{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">PR Title</Label>
                  <Input 
                    required 
                    placeholder="Briefly explain the changes..." 
                    className="h-14 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 text-lg font-bold placeholder:font-medium"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">PR Description</Label>
                  <Textarea 
                    placeholder="Describe what's changing (Markdown supported)..." 
                    className="min-h-[120px] rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 font-medium resize-none p-4"
                    value={formData.body}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || branches.length < 1}
                  className="w-full h-16 rounded-[2rem] bg-[#162C25] text-[#C8F064] text-lg font-black tracking-tight hover:shadow-2xl hover:shadow-[#162C25]/20 transition-all uppercase"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Deploy PR Block"}
                </Button>
              </form>
            ) : (
              <div className="space-y-8 text-center animate-in slide-in-from-bottom-5 duration-500">
                <div className="w-24 h-24 rounded-[2rem] bg-[#162C25] flex items-center justify-center text-[#C8F064] mx-auto shadow-2xl">
                  <CheckCircle2 size={48} />
                </div>
                
                <div>
                   <h3 className="text-xl font-black text-[#162C25]">Merge Ready!</h3>
                   <p className="text-sm font-bold text-[#162C25]/40 mt-2">The Pull Request has been deployed to GitHub.</p>
                </div>

                <Button 
                  onClick={() => onOpenChange(false)}
                  className="w-full h-16 rounded-[2rem] bg-[#C8F064] text-[#162C25] text-lg font-black tracking-tight hover:shadow-2xl hover:shadow-[#C8F064]/20 transition-all uppercase"
                >
                  Return to Canvas
                </Button>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
