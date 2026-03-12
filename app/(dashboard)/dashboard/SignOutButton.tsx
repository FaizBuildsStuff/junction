"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function signOut() {
    setIsLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      localStorage.removeItem("junction_user");
      localStorage.removeItem("junction_logged_in");
      window.dispatchEvent(new Event("junction-auth"));
      router.push("/signin");
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={signOut}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-2xl bg-[#162C25] px-5 py-3 text-[12px] font-black uppercase tracking-widest text-[#C8F064] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:pointer-events-none"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}

