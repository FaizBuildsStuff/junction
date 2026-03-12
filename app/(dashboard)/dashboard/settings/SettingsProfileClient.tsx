"use client";

import React, { useState } from "react";
import { updateProfile } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AtSign, Mail, ArrowRight, UserCog } from "lucide-react";

export default function SettingsProfileClient({
    initialUsername,
    initialEmail,
}: {
    initialUsername: string;
    initialEmail: string;
}) {
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const isChanged = username !== initialUsername || email !== initialEmail;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !email.trim()) return;

        setIsSubmitting(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await updateProfile({ username, email });
            setSuccessMsg("Profile updated successfully");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (e: any) {
            setError(e.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)] mt-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
                    <UserCog size={18} className="text-[#162C25]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                        Account Management
                    </p>
                    <p className="text-lg font-black text-[#162C25]">Edit Profile</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-xl space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1">
                            Username
                        </Label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
                            <Input
                                placeholder="Ex. johndoe"
                                className="h-12 pl-10 rounded-xl bg-[#F2F9F1] border-none font-bold text-[#162C25] focus-visible:ring-1 focus-visible:ring-[#162C25]/20"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/30 ml-1">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/20" size={14} />
                            <Input
                                type="email"
                                placeholder="Ex. email@example.com"
                                className="h-12 pl-10 rounded-xl bg-[#F2F9F1] border-none font-bold text-[#162C25] focus-visible:ring-1 focus-visible:ring-[#162C25]/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        {error}
                    </p>
                )}

                {successMsg && (
                    <p className="text-xs font-bold text-[#162C25] bg-[#C8F064]/20 p-3 rounded-xl border border-[#C8F064]/30">
                        {successMsg}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={!isChanged || isSubmitting}
                    className="w-full bg-[#162C25] text-[#C8F064] h-14 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#1d332c] transition-all flex justify-between px-10 group shadow-lg disabled:opacity-60"
                >
                    {isSubmitting ? "Saving changes..." : "Save Profile"}
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Button>
            </form>
        </div>
    );
}
