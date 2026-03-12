"use client";
import React, { useEffect, useState, useRef } from "react";
import { Zap, Menu, X, ArrowRight, Instagram, Twitter, Github } from "lucide-react";
import { gsap } from "gsap";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    gsap.from(".header-item", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.8, ease: "expo.out" });
      gsap.fromTo(".mobile-link", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power4.out", delay: 0.3 }
      );
    } else {
      gsap.to(menuRef.current, { x: "100%", duration: 0.6, ease: "expo.in" });
    }
  }, [isOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-10 lg:px-20 ${
          isScrolled 
            ? "py-4 bg-[#F2F9F1]/70 backdrop-blur-xl border-b border-black/5 shadow-[0_10px_30px_rgba(22,44,37,0.03)]" 
            : "py-6 md:py-8 bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <div className="header-item flex items-center gap-2 md:gap-3 group cursor-pointer relative z-[110]">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-[#162C25] rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg shadow-[#162C25]/20">
              <Zap size={18} className="text-[#C8F064] fill-[#C8F064] md:hidden" />
              <Zap size={22} className="text-[#C8F064] fill-[#C8F064] hidden md:block" />
            </div>
            <span className={`text-lg md:text-2xl font-black tracking-tighter uppercase transition-colors duration-500 ${isOpen ? 'text-white md:text-[#162C25]' : 'text-[#162C25]'}`}>
              Junction
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="header-item hidden md:flex items-center gap-8 lg:gap-10">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="group relative text-[12px] font-black text-[#162C25]/50 hover:text-[#162C25] transition-all uppercase tracking-widest py-2"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#162C25] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="header-item flex items-center gap-2 lg:gap-6">
            <button className="hidden lg:block text-[12px] font-black text-[#162C25] uppercase tracking-widest hover:opacity-60 transition-opacity">
              Log In
            </button>
            
            {/* CTA Button: Full on Desktop, Minimal on Mobile to prevent collision */}
            <button className="group relative bg-[#162C25] text-[#C8F064] px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[12px] font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-[0.98] shadow-xl shadow-[#162C25]/10">
              <span className="relative z-10 flex items-center gap-2">
                <span className="hidden sm:inline">Get Access</span>
                <ArrowRight size={16} className="md:group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            
            {/* MOBILE MENU TOGGLE */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-[110] p-2.5 rounded-xl transition-all duration-500 bg-[#162C25] text-[#C8F064] active:scale-90"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-[105] bg-[#162C25] translate-x-full flex flex-col md:hidden"
      >
        <div className="absolute top-20 left-10 opacity-[0.03] text-[15rem] font-black text-white pointer-events-none rotate-90 origin-left leading-none">
          MENU
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 gap-6 mt-20">
          <p className="text-[#C8F064] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Navigation</p>
          {["Product", "Solutions", "Pricing", "Enterprise"].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="mobile-link text-5xl font-black text-white hover:text-[#C8F064] transition-colors uppercase tracking-tighter"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="p-10 bg-white/5 border-t border-white/10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Connect With Us</p>
              <div className="flex gap-6 text-white">
                <Twitter size={20} className="hover:text-[#C8F064] transition-colors" />
                <Instagram size={20} className="hover:text-[#C8F064] transition-colors" />
                <Github size={20} className="hover:text-[#C8F064] transition-colors" />
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-16 h-16 bg-[#C8F064] rounded-full flex items-center justify-center text-[#162C25] shadow-lg shadow-[#C8F064]/20"
            >
              <X size={32} />
            </button>
          </div>
          <p className="mt-10 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            © Junction Cost Intelligence 2026
          </p>
        </div>
      </div>
    </>
  );
}