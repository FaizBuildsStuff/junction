"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Zap, Instagram, Linkedin, Twitter, Github } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicFooter() {
  const footerRef = useRef(null);
  const bigTextRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    // 1. Digital Clock (Lahore Time)
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit",
        timeZone: "Asia/Karachi" 
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    const ctx = gsap.context(() => {
      // 2. Giant Wordmark Reveal
      gsap.fromTo(bigTextRef.current, 
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          duration: 1.5, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          }
        }
      );

      // 3. Staggered Links Entrance
      gsap.from(".footer-link-group", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
        }
      });
    }, footerRef);

    return () => {
        ctx.revert();
        clearInterval(interval);
    };
  }, []);

  const socialLinks = [
    { name: "Instagram", icon: Instagram },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Twitter", icon: Twitter },
    { name: "Github", icon: Github },
  ];

  return (
    <footer ref={footerRef} className="bg-[#F2F9F1] pt-32 pb-10 px-6 md:px-16 overflow-hidden font-satoshi border-t border-[#162C25]/5">
      <div className="max-w-[1440px] mx-auto">
        
        {/* TOP ROW: Navigation & Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-40">
          
          {/* Brand & Local Time */}
          <div className="md:col-span-4 footer-link-group">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#162C25] rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-[#C8F064] fill-[#C8F064]" />
              </div>
              <span className="text-xl font-black text-[#162C25] uppercase tracking-tighter">Junction™</span>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.3em]">Local Time / LHE</p>
                <p className="text-4xl font-black text-[#162C25]">{time}</p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-3 footer-link-group">
            <p className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.3em] mb-8">Navigation</p>
            <div className="flex flex-col gap-4">
              {["Home", "Features", "Pricing", "Integrations", "Support"].map((item) => (
                <a key={item} href="#" className="group flex items-center gap-2 text-lg font-bold text-[#162C25] hover:text-[#C8F064] transition-colors">
                   {item} <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 footer-link-group">
            <p className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.3em] mb-8">Socials</p>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social) => (
                <a key={social.name} href="#" className="group flex items-center gap-2 text-lg font-bold text-[#162C25] hover:text-[#C8F064] transition-colors">
                   {social.name} <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div className="md:col-span-2 footer-link-group flex flex-col items-start md:items-end">
             <p className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.3em] mb-8">Status</p>
             <div className="flex items-center gap-2 px-4 py-2 bg-[#C8F064]/20 border border-[#C8F064] rounded-full">
                <div className="w-2 h-2 bg-[#162C25] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#162C25] uppercase tracking-widest">System Operational</span>
             </div>
          </div>
        </div>

        {/* MIDDLE ROW: The Giant "OP" Wordmark */}
        <div className="relative pointer-events-none select-none py-10">
          <h1 
            ref={bigTextRef}
            className="text-[22vw] font-black text-[#162C25] leading-none tracking-[-0.08em] whitespace-nowrap text-center"
          >
            JUNCTION
          </h1>
        </div>

        {/* BOTTOM ROW: Legal & Credits */}
        <div className="mt-20 pt-10 border-t border-[#162C25]/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-10">
                <p className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.2em]">ESTABLISHED IN 2026</p>
                <a href="#" className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.2em] hover:text-[#162C25]">Privacy Policy</a>
            </div>
            
            <p className="text-[10px] font-black text-[#162C25]/20 uppercase tracking-[0.2em] text-center max-w-sm">
                Optimized Financial Infrastructure for high-velocity engineering teams. Built with precision.
            </p>
            
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#162C25]/30 uppercase tracking-[0.2em]">Designed by</span>
                <span className="text-[10px] font-black text-[#162C25] uppercase tracking-[0.2em]">Faiz Agency®</span>
            </div>
        </div>
      </div>
    </footer>
  );
}