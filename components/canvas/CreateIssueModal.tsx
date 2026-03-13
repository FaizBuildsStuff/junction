"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  X, 
  CircleDot, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGitHubIssue } from "@/app/actions/github";

export default function CreateIssueModal({
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

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createGitHubIssue(owner, repo, formData.title, formData.body);
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
          
          <div className="p-8 border-b border-[#162C25]/5 flex items-center justify-between bg-amber-50/30">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#162C25] flex items-center justify-center text-amber-400">
                  <CircleDot size={24} />
               </div>
               <div>
                  <Dialog.Title className="text-2xl font-black text-[#162C25] tracking-tight">
                    {step === 1 ? "New Issue Block" : "Issue Created"}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs font-bold text-[#162C25]/40 uppercase tracking-widest">
                    {step === 1 ? `Add a task to ${repo}` : "Syncing with canvas..."}
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">
                    {error}
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Issue Title</Label>
                  <Input 
                    required 
                    placeholder="Describe the problem..." 
                    className="h-16 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 text-lg font-bold placeholder:font-medium"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 ml-1">Detailed Description</Label>
                  <Textarea 
                    placeholder="Provide more context (Markdown supported)..." 
                    className="min-h-[150px] rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/10 font-medium resize-none p-6"
                    value={formData.body}
                    onChange={e => setFormData({...formData, body: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-[2rem] bg-[#162C25] text-[#C8F064] text-lg font-black tracking-tight hover:shadow-2xl hover:shadow-[#162C25]/20 transition-all uppercase"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Deploy Issue Block"}
                </Button>
              </form>
            ) : (
              <div className="space-y-8 text-center animate-in slide-in-from-bottom-5 duration-500">
                <div className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-200">
                  <CheckCircle2 size={48} />
                </div>
                
                <div>
                   <h3 className="text-xl font-black text-[#162C25]">Mission Success!</h3>
                   <p className="text-sm font-bold text-[#162C25]/40 mt-2">The issue has been added to GitHub and will appear on your canvas shortly.</p>
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
