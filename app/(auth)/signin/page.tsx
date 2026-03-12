"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Zap, ArrowRight, Github, Chrome, Fingerprint, ShieldCheck, Command, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Stagger for UI elements
      gsap.from(".reveal-item", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power4.out",
      });

      // 2. Kinetic "Data-Stream" Animation
      gsap.to(".data-stream", {
        x: "100vw",
        duration: "random(2, 5)",
        repeat: -1,
        ease: "none",
        stagger: {
          each: 0.4,
          from: "random"
        }
      });

      // 3. Floating UI Card
      gsap.to(".floating-card", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, visualRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen flex bg-white selection:bg-[#C8F064] font-satoshi overflow-hidden">
      
      {/* LEFT SIDE: THE TERMINAL (SHADCN FORM) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-16 z-20 bg-white border-r border-[#162C25]/5">
        
        {/* Brand Header & Sign Up Link */}
        <div className="flex justify-between items-center reveal-item">
            <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="w-10 h-10 bg-[#162C25] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <Zap size={20} className="text-[#C8F064] fill-[#C8F064]" />
                </div>
                <span className="text-xl font-black text-[#162C25] uppercase tracking-tighter">Junction™</span>
            </Link>

            <Link href="/signup" className="group flex items-center gap-2 px-5 py-2 bg-[#F2F9F1] rounded-full hover:bg-[#162C25] transition-all duration-500">
                <span className="text-[10px] font-black text-[#162C25] group-hover:text-white uppercase tracking-widest">Sign Up</span>
                <ArrowUpRight size={14} className="text-[#162C25] group-hover:text-[#C8F064] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
        </div>

        {/* Form Body */}
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="reveal-item text-5xl md:text-6xl font-black text-[#162C25] tracking-tight mb-4">
              Initialize.
            </h1>
            <p className="reveal-item text-[#162C25]/50 font-medium text-lg leading-relaxed">
              Authenticate to access your firm's <br className="hidden md:block" /> financial infrastructure terminal.
            </p>
          </div>

          <div className="space-y-8">
            {/* SHADCN INPUTS */}
            <div className="reveal-item space-y-3">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40 ml-1">
                Organization Email
              </Label>
              <Input 
                id="email"
                type="email" 
                placeholder="rehman@junction.ai"
                className="h-16 rounded-2xl bg-[#F2F9F1] border-none px-6 font-bold text-[#162C25] focus-visible:ring-2 focus-visible:ring-[#C8F064] transition-all"
              />
            </div>

            <div className="reveal-item space-y-3">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40">
                  Access Key
                </Label>
                <Link href="#" className="text-[10px] font-black uppercase text-[#C8F064] bg-[#162C25] px-2 py-0.5 rounded hover:scale-105 transition-transform">Forgot?</Link>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                className="h-16 rounded-2xl bg-[#F2F9F1] border-none px-6 font-bold text-[#162C25] focus-visible:ring-2 focus-visible:ring-[#C8F064] transition-all"
              />
            </div>

            <Button className="reveal-item w-full bg-[#162C25] text-[#C8F064] h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-[#1D3A32] transition-all flex justify-between px-8 group shadow-xl shadow-[#162C25]/10">
              Start Session <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          {/* Social Auth Section */}
          <div className="reveal-item mt-12">
            <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#162C25]/5" /></div>
                <span className="relative bg-white px-4 text-[10px] font-black text-[#162C25]/20 uppercase tracking-[0.3em]">Corporate Auth</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-[#162C25]/5 bg-white hover:bg-[#F2F9F1] font-black text-[10px] uppercase tracking-widest gap-3 transition-colors">
                <Github size={16} /> Github
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-[#162C25]/5 bg-white hover:bg-[#F2F9F1] font-black text-[10px] uppercase tracking-widest gap-3 transition-colors">
                <Chrome size={16} /> Google
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="reveal-item flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-[#162C25]/20 mt-10 md:mt-0">
          <div className="flex items-center gap-4">
            <span>Security Protocol AES-256</span>
            <div className="w-1 h-1 bg-[#162C25]/10 rounded-full" />
            <span className="flex items-center gap-1"><ShieldCheck size={12}/> ISO 27001</span>
          </div>
          <span>© 2026 JUNCTION INC.</span>
        </div>
      </div>

      {/* RIGHT SIDE: THE KINETIC ENGINE (VISUALS) */}
      <div ref={visualRef} className="hidden lg:flex flex-1 bg-[#162C25] relative items-center justify-center overflow-hidden">
        
        {/* Animated Background Data Streams */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="data-stream absolute h-[1px] bg-gradient-to-r from-transparent via-[#C8F064]/40 to-transparent w-[50%]" 
              style={{ top: `${i * 7}%`, left: "-60%" }}
            />
          ))}
        </div>

        {/* THE "CORE" CARD (Floating UI) */}
        <div className="floating-card relative z-10 w-full max-w-md">
            <div className="absolute inset-0 bg-[#C8F064]/10 blur-[120px] rounded-full animate-pulse" />
            
            <div className="relative aspect-[4/5] bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-2xl p-10 flex flex-col justify-between overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C8F064]/10 rounded-full blur-3xl group-hover:bg-[#C8F064]/20 transition-colors duration-1000" />

              <div className="flex justify-between items-start relative z-10">
                  <div className="p-5 bg-[#C8F064] rounded-3xl shadow-2xl shadow-[#C8F064]/20">
                    <Fingerprint size={32} className="text-[#162C25]" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#C8F064] animate-pulse" />
                      <p className="text-[10px] font-black text-[#C8F064] tracking-[0.2em] uppercase">Auth Level 4</p>
                    </div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</p>
                  </div>
              </div>

              <div className="relative z-10">
                <h2 className="text-white text-5xl font-black leading-[1.1] tracking-tighter mb-6">
                  Fiscal <br /> 
                  Infrastructure <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8F064] to-white">Governance.</span>
                </h2>
                <div className="flex gap-4">
                  <div className="h-1 w-12 bg-[#C8F064] rounded-full" />
                  <div className="h-1 w-4 bg-white/20 rounded-full" />
                  <div className="h-1 w-4 bg-white/20 rounded-full" />
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-10 border-t border-white/5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Command size={14} className="text-white/40" />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Zap size={14} className="text-white/40" />
                  </div>
                </div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Node_Connected</span>
              </div>
            </div>
        </div>
      </div>
    </main>
  );
}