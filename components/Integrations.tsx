"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Cpu, Link, Globe, ShieldCheck, Database, Command } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tools = [
  { name: "Slack", icon: Cpu, color: "#4A154B" },
  { name: "Stripe", icon: Link, color: "#635BFF" },
  { name: "AWS", icon: Database, color: "#FF9900" },
  { name: "Vercel", icon: Globe, color: "#000000" },
  { name: "Azure", icon: ShieldCheck, color: "#0089D6" },
  { name: "Linear", icon: Command, color: "#5E6AD2" },
];

export default function Integrations() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Core Logo Pulse
      gsap.to(".pulse-ring", {
        scale: 2.5,
        opacity: 0,
        duration: 3,
        stagger: 0.8,
        repeat: -1,
        ease: "power2.out",
      });

      // 2. Icon Floating (Subtle and Professional)
      gsap.to(".tool-card", {
        y: "random(-15, 15)",
        rotation: "random(-2, 2)",
        duration: "random(2.5, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3. Section Reveal
      gsap.from(".reveal-text", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-[#F2F9F1] px-4 md:px-10 overflow-hidden relative font-satoshi">
      
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        
        {/* Modern Label */}
        <div className="reveal-text inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 mb-8 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C8F064] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]">Interconnected Ecosystem</span>
        </div>

        <h2 className="reveal-text text-5xl md:text-8xl lg:text-[110px] font-black text-[#162C25] tracking-[-0.06em] leading-[0.85] mb-10">
          Native integration <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162C25] to-[#5E6D68]">for every tool.</span>
        </h2>
        
        <p className="reveal-text max-w-2xl mx-auto text-lg md:text-xl text-[#162C25]/50 font-medium mb-20 md:mb-32">
          Junction bridges the gap between your cloud infrastructure and financial reporting with one-click API sync.
        </p>

        {/* RESPONSIVE RADAR/GRID CONTAINER */}
        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[700px] w-full">
          
          {/* CENTRAL ENGINE */}
          <div className="relative z-20 scale-75 md:scale-100">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#162C25] rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(22,44,37,0.2)]">
                <Zap size={40} className="text-[#C8F064] fill-[#C8F064]" />
                {/* Pulse Rings */}
                <div className="pulse-ring absolute inset-0 border border-[#162C25]/20 rounded-[2.5rem]" />
                <div className="pulse-ring absolute inset-0 border border-[#162C25]/10 rounded-[2.5rem]" />
            </div>
          </div>

          {/* DYNAMIC ICON MAPPING: Responsive Orbit */}
          <div className="absolute inset-0 flex items-center justify-center">
            {tools.map((tool, i) => {
                const Icon = tool.icon;
                
                // Logic: On mobile (innerWidth < 768), we use a tighter radius or a different layout
                // We handle this via CSS variables to keep it 100% responsive and fit-in-screen
                return (
                  <div 
                    key={tool.name}
                    className="tool-card absolute flex flex-col items-center gap-4"
                    style={{
                        // Calculation for the circular orbit that adapts per screen size
                        "--radius": "clamp(140px, 35vw, 320px)",
                        transform: `rotate(${i * (360 / tools.length)}deg) translateY(calc(-1 * var(--radius))) rotate(-${i * (360 / tools.length)}deg)`
                    } as React.CSSProperties}
                  >
                    <div className="group relative">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[2rem] shadow-xl md:shadow-2xl flex items-center justify-center border border-[#162C25]/5 group-hover:border-[#C8F064] transition-all duration-500 cursor-pointer">
                            <Icon size={28} className="text-[#162C25] group-hover:scale-110 transition-transform" />
                        </div>
                        
                        {/* Status Label */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-[9px] font-black text-[#162C25] uppercase tracking-widest bg-[#C8F064] px-3 py-1 rounded-md">
                                {tool.name}
                            </span>
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>

          {/* BACKGROUND DECORATION: SVG Radar Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
            <circle cx="50%" cy="50%" r="140" fill="none" stroke="#162C25" strokeWidth="2" strokeDasharray="10 20" />
            <circle cx="50%" cy="50%" r="240" fill="none" stroke="#162C25" strokeWidth="2" strokeDasharray="10 20" />
            <circle cx="50%" cy="50%" r="340" fill="none" stroke="#162C25" strokeWidth="2" strokeDasharray="10 20" />
          </svg>
        </div>
      </div>
    </section>
  );
}