"use client";

import React, { useState } from "react";
import { stackServices } from "@/lib/constants";
import { upsertServiceKey, deleteServiceKey } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Check, Trash2, Edit2, KeyRound, Eye, EyeOff } from "lucide-react";
import { type ServiceKeyRow } from "@/lib/service-keys";

export function maskSecret(value: string) {
    const v = value.trim();
    if (v.length <= 8) return "••••••••";
    return `${v.slice(0, 4)}••••••••${v.slice(-4)}`;
}

export default function InfrastructureKeysClient({ storedKeys }: { storedKeys: ServiceKeyRow[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedService, setExpandedService] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingValues, setEditingValues] = useState<Record<string, string>>({});
    const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

    const toggleService = (id: string) => {
        setExpandedService((prev) => (prev === id ? null : id));
    };

    const filteredServices = stackServices.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const keyMap = storedKeys.reduce((acc, k) => {
        acc[k.service_id] = k.value_text;
        return acc;
    }, {} as Record<string, string>);

    const handleEditChange = (serviceId: string, value: string) => {
        setEditingValues((prev) => ({ ...prev, [serviceId]: value }));
    };

    const toggleVisibility = (serviceId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setVisibleKeys(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
    };

    const handleSave = async (serviceId: string) => {
        const value = editingValues[serviceId];
        if (!value?.trim()) return;

        setIsSubmitting(true);
        try {
            await upsertServiceKey(serviceId, value);
            setEditingValues((prev) => {
                const next = { ...prev };
                delete next[serviceId];
                return next;
            });
            setVisibleKeys(prev => ({ ...prev, [serviceId]: false }));
            setExpandedService(null);
        } catch (e) {
            console.error(e);
            alert("Failed to save key");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (serviceId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this key?")) return;

        setIsSubmitting(true);
        try {
            await deleteServiceKey(serviceId);
            setEditingValues((prev) => {
                const next = { ...prev };
                delete next[serviceId];
                return next;
            });
        } catch (e) {
            console.error(e);
            alert("Failed to delete key");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)] mt-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center">
                    <KeyRound size={18} className="text-[#162C25]" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/30">
                        Management
                    </p>
                    <p className="text-lg font-black text-[#162C25]">Service Keys</p>
                </div>
            </div>


            <div className="space-y-3">
                {filteredServices.map((service) => {
                    const Icon = service.icon;
                    const isOpen = expandedService === service.id;
                    const hasKey = !!keyMap[service.id];
                    const isEditing = editingValues[service.id] !== undefined;
                    const isVisible = visibleKeys[service.id];

                    return (
                        <div
                            key={service.id}
                            className={`border overflow-hidden rounded-2xl transition-all duration-300 ${isOpen ? "border-[#C8F064] bg-[#F2F9F1]/50 shadow-sm" : "border-[#162C25]/5 bg-white hover:border-[#162C25]/20"
                                }`}
                        >
                            <div
                                onClick={() => toggleService(service.id)}
                                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-[#F2F9F1]/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${hasKey ? "bg-[#162C25] text-[#C8F064]" : "bg-[#F2F9F1] text-[#162C25]/70"
                                            }`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm text-[#162C25] block">{service.name}</span>
                                        {hasKey && !isOpen && (
                                            <span className="text-xs text-[#162C25]/50 font-mono mt-1 block">
                                                {isVisible ? keyMap[service.id] : maskSecret(keyMap[service.id])}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {hasKey && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 mr-2 rounded-full bg-[#162C25] text-[#C8F064] hidden md:inline-block">
                                                Connected
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => toggleVisibility(service.id, e)}
                                                className="p-2 hover:bg-[#162C25]/5 rounded-lg text-[#162C25]/40 hover:text-[#162C25] transition-colors"
                                                title={isVisible ? "Hide Key" : "View Key"}
                                            >
                                                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingValues(prev => ({ ...prev, [service.id]: keyMap[service.id] }));
                                                    setExpandedService(service.id);
                                                }}
                                                className="p-2 hover:bg-[#162C25]/5 rounded-lg text-[#162C25]/40 hover:text-[#162C25] transition-colors"
                                                title="Edit Key"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleDelete(service.id, e)}
                                                disabled={isSubmitting}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                title="Disconnect Service"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    {!hasKey && <div className="text-xs font-bold text-[#162C25]/40 bg-[#F2F9F1] px-3 py-1 rounded-full hidden md:block">Not Connected</div>}
                                    <ChevronDown
                                        size={16}
                                        className={`text-[#162C25]/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </div>

                            {isOpen && (
                                <div className="p-4 pt-0 border-t border-[#162C25]/5 bg-white m-1 rounded-xl">
                                    <div className="flex gap-2 mt-4">
                                        {service.id === "github" && !hasKey ? (
                                            <Button
                                                onClick={() => {
                                                    setIsSubmitting(true);
                                                    window.location.href = "/api/oauth/github/init";
                                                }}
                                                disabled={isSubmitting}
                                                className="h-11 px-8 rounded-xl bg-[#24292e] text-white hover:bg-[#1a1e22] transition-all font-bold w-full"
                                            >
                                                {isSubmitting ? "Redirecting..." : "Connect with GitHub"}
                                            </Button>
                                        ) : (
                                            <>
                                                <Input
                                                    placeholder={service.placeholder}
                                                    className="h-11 bg-[#F2F9F1] border-none text-sm font-mono rounded-xl focus-visible:ring-1 focus-visible:ring-[#162C25]/20"
                                                    value={isEditing ? editingValues[service.id] : (editingValues[service.id] || "")}
                                                    onChange={(e) => {
                                                        handleEditChange(service.id, e.target.value);
                                                    }}
                                                    type={isVisible ? "text" : "password"}
                                                    autoComplete="off"
                                                />
                                                <Button
                                                    onClick={() => handleSave(service.id)}
                                                    disabled={isSubmitting || !editingValues[service.id]?.trim() || editingValues[service.id] === keyMap[service.id]}
                                                    className="h-11 px-6 rounded-xl bg-[#162C25] text-[#C8F064] hover:bg-[#1d332c] transition-all font-bold"
                                                >
                                                    {isSubmitting ? (hasKey ? "Updating..." : "Connecting...") : (hasKey ? <><Check size={16} className="mr-2" /> Update</> : "Connect Service")}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredServices.length === 0 && (
                    <div className="text-center py-8 text-[#162C25]/50 text-sm font-medium">
                        No services found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
}
