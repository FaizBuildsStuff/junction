"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Zap, ArrowRight, Github, Chrome, ShieldCheck,
  CheckCircle2, Lock, Building2, ChevronDown,
  Cpu, Database, Globe, Cloud, Key, Search, Mail, LockKeyhole, AtSign, Code2, Terminal, Layers, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { stackServices } from "@/lib/constants";

export default function SignUpPage() {
  const containerRef = useRef(null);
  const router = useRouter();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Credentials State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // API Keys Storage State
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredServices = stackServices.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle individual API Key changes
  const handleKeyChange = (serviceId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-node", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Clean up empty keys before sending
    const activeKeys = Object.fromEntries(
      Object.entries(apiKeys).filter(([_, value]) => value.trim() !== "")
    );

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          services: activeKeys // This sends the stored keys to your backend
        }),
      });

      const data = (await res.json()) as { ok: boolean; user?: any; error?: string };

      if (!res.ok || !data.ok || !data.user) {
        setError(data.error ?? "Failed to sign up.");
        return;
      }

      localStorage.setItem("junction_user", JSON.stringify(data.user));
      localStorage.setItem("junction_logged_in", "true");
      window.dispatchEvent(new Event("junction-auth"));
      router.push("/dashboard");
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main ref={containerRef} className="relative min-h-screen flex flex-col lg:flex-row bg-white selection:bg-[#C8F064] font-satoshi overflow-x-hidden">

      <div className="w-full lg:w-[55%] flex flex-col justify-between p-6 md:p-12 lg:p-16 z-20 bg-white border-r border-[#162C25]/5">

        {/* Brand Header */}
        <div className="flex justify-between items-center reveal-node mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#162C25] rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-[#C8F064] fill-[#C8F064]" />
            </div>
            <span className="text-xl font-black text-[#162C25] uppercase tracking-tighter">Junction™</span>
          </Link>
          <Link href="/signin" className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 border-b border-transparent hover:border-[#162C25] transition-all">
            Existing Member? Login
          </Link>
        </div>

        <form
          className="max-w-xl w-full mx-auto flex-1 flex flex-col justify-center"
          onSubmit={onSubmit}
        >
          <h1 className="reveal-node text-4xl md:text-5xl font-black text-[#162C25] tracking-tight mb-8">
            Create Your <br /> <span className="text-[#162C25]/30">Junction Profile.</span>
          </h1>

          {/* STEP 1: CREDENTIALS */}
          <div className="space-y-4 mb-8">
            <div className="reveal-node grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1">Username</Label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
                  <Input
                    placeholder="aka_faiz"
                    className="h-12 pl-10 rounded-xl bg-[#F2F9F1] border-none font-bold text-[#162C25]"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
                  <Input
                    placeholder="rehman@agency.ai"
                    className="h-12 pl-10 rounded-xl bg-[#F2F9F1] border-none font-bold text-[#162C25]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="reveal-node space-y-1.5">
              <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  className="h-12 pl-10 rounded-xl bg-[#F2F9F1] border-none font-bold text-[#162C25]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          {/* STEP 2: STACK SELECTION */}
          <div className="reveal-node mb-8">
            <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1 block mb-3">Provision Services</Label>

            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stack..."
                className="h-10 pl-10 rounded-xl bg-[#F2F9F1] border-none text-xs font-medium"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar border-b border-[#162C25]/5 pb-4">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                const isOpen = expandedService === service.id;
                return (
                  <div key={service.id} className={`border rounded-xl transition-all duration-300 ${isOpen ? "border-[#C8F064] bg-[#F2F9F1]/50" : "border-[#162C25]/5 bg-white"}`}>
                    <button type="button" onClick={() => setExpandedService(isOpen ? null : service.id)} className="w-full flex items-center justify-between p-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isOpen ? "bg-[#162C25] text-[#C8F064]" : "bg-[#F2F9F1] text-[#162C25]"}`}><Icon size={14} /></div>
                        <span className="font-bold text-xs text-[#162C25]">{service.name}</span>
                        {apiKeys[service.id] && <div className="w-1.5 h-1.5 rounded-full bg-[#C8F064]" />}
                      </div>
                      <ChevronDown size={12} className={`text-[#162C25]/20 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-1">
                        <Input
                          placeholder={service.placeholder}
                          className="h-9 bg-white border-[#162C25]/10 text-[10px] font-mono rounded-lg"
                          value={apiKeys[service.id] || ""}
                          onChange={(e) => handleKeyChange(service.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIGN UP BUTTON */}
          <div className="reveal-node">
            {error && <p className="mb-3 text-xs font-bold text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#162C25] text-[#C8F064] h-14 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#1d332c] transition-all flex justify-between px-10 group shadow-xl disabled:opacity-60"
            >
              {isSubmitting ? "Authenticating..." : "Initialize Profile"}
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </form>

        <div className="reveal-node flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-[#162C25]/20 pt-8 mt-auto border-t border-[#162C25]/5">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Lock size={12} /> SHA-256</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> SOC2 Compliance</span>
          </div>
          <span>© 2026 JUNCTION INC.</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#162C25] relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[#C8F064] font-black text-[10px] uppercase tracking-[0.6em] mb-12">System Protocol</p>
          <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tighter">
            Predict <br /> Everything. <br /> <span className="text-[#C8F064]">Profitably.</span>
          </h2>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-md">
          <p className="text-white/70 text-lg font-medium italic">"The most professional way to track developer burn."</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C8F064]" />
            <div>
              <p className="text-white font-black text-[10px] uppercase tracking-widest">Adam Milne</p>
              <p className="text-[#C8F064] text-[8px] font-black uppercase tracking-widest">VP Engineering • Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 