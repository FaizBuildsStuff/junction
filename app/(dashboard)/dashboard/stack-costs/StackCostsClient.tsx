"use client";

import React from "react";
import { stackServices } from "@/lib/constants";
import { type MockCostSummary } from "@/lib/integrations/mock-costs";
import { formatMoneyMinor } from "@/lib/integrations/stripe";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { GitHubManagementDialog } from "@/components/GitHubManagementDialog";

export default function StackCostsClient({ mockCosts }: { mockCosts: MockCostSummary[] }) {
    const [isGithubDialogOpen, setIsGithubDialogOpen] = React.useState(false);

    if (mockCosts.length === 0) {
        return (
            <div className="bg-white rounded-[3rem] border border-[#162C25]/5 p-10 shadow-[0_20px_50px_rgba(22,44,37,0.04)] mt-6 text-center">
                <p className="text-[#162C25]/50 font-medium">
                    No other services connected yet. Add keys in the Infrastructure tab to see simulations.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {mockCosts.map((cost) => {
                const serviceDef = stackServices.find((s) => s.id === cost.serviceId);
                if (!serviceDef) return null;

                const Icon = serviceDef.icon;
                const isGithub = cost.serviceId === "github";

                // Calculate percentages safely
                const limit = cost.monthlyLimit || 1;
                const rawPercent = (cost.currentSpend / limit) * 100;
                const progressPercent = Math.min(Math.max(rawPercent, 0), 100);

                // Determine colors based on status
                let statusColor = "bg-[#C8F064] text-[#162C25]";
                let progressColor = "bg-[#162C25]";
                let StatusIcon = CheckCircle2;

                if (cost.status === "warning") {
                    statusColor = "bg-amber-100 text-amber-700 border border-amber-200";
                    progressColor = "bg-amber-500";
                    StatusIcon = Clock;
                } else if (cost.status === "exceeded") {
                    statusColor = "bg-red-100 text-red-700 border border-red-200";
                    progressColor = "bg-red-500";
                    StatusIcon = AlertCircle;
                }

                // Days until renewal
                const renewal = new Date(cost.renewalDate);
                const diffTime = Math.abs(renewal.getTime() - new Date().getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return (
                    <div
                        key={cost.serviceId}
                        onClick={() => isGithub && setIsGithubDialogOpen(true)}
                        className={`group relative bg-white rounded-[2.5rem] p-8 border border-[#162C25]/5 shadow-[0_8px_30px_rgba(22,44,37,0.03)] hover:shadow-[0_20px_50px_rgba(22,44,37,0.06)] transition-all duration-500 flex flex-col justify-between overflow-hidden ${isGithub ? 'cursor-pointer hover:border-[#162C25]/20' : ''}`}
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F2F9F1] to-transparent opacity-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform duration-700" />

                        <div>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center text-[#162C25] group-hover:bg-[#162C25] group-hover:text-[#C8F064] transition-colors duration-300">
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-xl text-[#162C25]">{serviceDef.name}</h3>
                                            {isGithub && (
                                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#162C25]/5 text-[#162C25]/40 group-hover:bg-[#162C25] group-hover:text-[#C8F064] transition-colors">
                                                    Manage
                                                </span>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-1.5 mt-1.5 px-2.5 py-1 w-fit rounded-lg text-[10px] uppercase tracking-widest font-bold ${statusColor}`}>
                                            <StatusIcon size={12} />
                                            {cost.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spend section */}
                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40 mb-2">
                                    {cost.currency === "USD" ? "Current Spend" : `Live ${cost.currency}`}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-[#162C25] tracking-tight">
                                        {cost.currency === "USD"
                                            ? formatMoneyMinor(cost.currentSpend * 100, cost.currency)
                                            : cost.currentSpend.toLocaleString()
                                        }
                                    </span>
                                    {cost.monthlyLimit && (
                                        <span className="text-sm font-bold text-[#162C25]/40">
                                            / {cost.currency === "USD"
                                                ? formatMoneyMinor(cost.monthlyLimit * 100, cost.currency)
                                                : cost.monthlyLimit.toLocaleString()
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Extended Metrics */}
                            {cost.details && cost.details.length > 0 && (
                                <div className="mb-6 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#162C25]/40 mb-2">
                                        Extended Metrics
                                    </p>
                                    <div className="bg-[#F2F9F1]/50 rounded-2xl p-4 border border-[#162C25]/5 space-y-3">
                                        {cost.details.map((detail, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-[#162C25]/5 pb-3 last:border-0 last:pb-0">
                                                <span className="font-bold text-[#162C25]/60">{detail.label}</span>
                                                <span className="font-black text-[#162C25] text-right ml-4 break-all">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Progress Bar (Only show if limit exists) */}
                            {cost.monthlyLimit && (
                                <div className="mb-8">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#162C25]/50 mb-3">
                                        <span>Usage Limit</span>
                                        <span className={cost.status === "exceeded" ? "text-red-500" : ""}>{rawPercent.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-[#F2F9F1] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Renewal */}
                        <div className="pt-6 border-t border-[#162C25]/5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#162C25]/40 mb-1">
                                    Renews In
                                </p>
                                <p className="text-sm font-bold text-[#162C25] flex items-center gap-2">
                                    {diffDays} {diffDays === 1 ? 'day' : 'days'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#162C25]/40 mb-1">
                                    Next Cycle
                                </p>
                                <p className="text-xs font-bold text-[#162C25]/70">
                                    {renewal.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            <GitHubManagementDialog
                isOpen={isGithubDialogOpen}
                onOpenChange={setIsGithubDialogOpen}
            />
        </div>
    );
}
