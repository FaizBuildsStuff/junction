"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
    X,
    Github,
    GitPullRequest,
    CircleDot,
    Search,
    Plus,
    ChevronRight,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { getGitHubRepos, getGitHubIssues, createGitHubIssue, createGitHubPR } from "@/app/actions/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Repo {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    html_url: string;
}

interface Issue {
    id: number;
    number: number;
    title: string;
    html_url: string;
    user: { login: string };
}

export function GitHubManagementDialog({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [view, setView] = useState<"repos" | "issues" | "create-issue" | "create-pr">("repos");

    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadRepos();
        } else {
            // Reset state on close
            setTimeout(() => {
                setView("repos");
                setSelectedRepo(null);
                setSearch("");
                setFormSuccess(null);
                setFormError(null);
            }, 300);
        }
    }, [isOpen]);

    const loadRepos = async () => {
        setLoading(true);
        try {
            const data = await getGitHubRepos();
            setRepos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRepo = async (repo: Repo) => {
        setSelectedRepo(repo);
        setLoading(true);
        setView("issues");
        try {
            const data = await getGitHubIssues(repo.owner.login, repo.name);
            setIssues(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIssue = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedRepo) return;
        setFormLoading(true);
        setFormError(null);
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const body = formData.get("body") as string;

        try {
            await createGitHubIssue(selectedRepo.owner.login, selectedRepo.name, title, body);
            setFormSuccess("Issue created successfully!");
            setTimeout(() => setView("issues"), 1500);
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleCreatePR = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedRepo) return;
        setFormLoading(true);
        setFormError(null);
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const head = formData.get("head") as string;
        const base = formData.get("base") as string;
        const body = formData.get("body") as string;

        try {
            await createGitHubPR(selectedRepo.owner.login, selectedRepo.name, title, head, base, body);
            setFormSuccess("Pull Request created successfully!");
            setTimeout(() => setView("issues"), 1500);
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const filteredRepos = repos.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-[#162C25]/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white rounded-[3rem] border border-[#162C25]/5 shadow-[0_40px_100px_rgba(22,44,37,0.15)] z-[101] flex flex-col animate-in zoom-in-95 duration-500">

                    {/* Header */}
                    <div className="p-8 border-b border-[#162C25]/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#F2F9F1] border border-[#162C25]/5 flex items-center justify-center text-[#162C25]">
                                <Github size={24} />
                            </div>
                            <div>
                                <Dialog.Title className="text-2xl font-black text-[#162C25] tracking-tight">
                                    {view === "repos" ? "GitHub Repositories" : selectedRepo?.name}
                                </Dialog.Title>
                                <Dialog.Description className="text-xs font-medium text-[#162C25]/50 flex items-center gap-2">
                                    {view === "repos" ? "Choose a repository to manage" : selectedRepo?.full_name}
                                </Dialog.Description>
                            </div>
                        </div>
                        <Dialog.Close asChild>
                            <button className="w-10 h-10 rounded-full hover:bg-[#F2F9F1] flex items-center justify-center text-[#162C25]/40 hover:text-[#162C25] transition-all">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {view === "repos" && (
                            <div className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#162C25]/30" size={18} />
                                    <Input
                                        placeholder="Search repositories..."
                                        className="pl-12 h-14 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/5"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="animate-spin text-[#162C25]/20" size={40} />
                                        <p className="text-sm font-bold text-[#162C25]/30">Loading your repositories...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredRepos.map(repo => (
                                            <button
                                                key={repo.id}
                                                onClick={() => handleSelectRepo(repo)}
                                                className="group flex items-center justify-between p-5 rounded-2xl border border-[#162C25]/5 hover:bg-[#F2F9F1] transition-all text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F2F9F1] group-hover:bg-white border border-[#162C25]/5 flex items-center justify-center text-[#162C25]/40 group-hover:text-[#162C25] transition-colors">
                                                        <CircleDot size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#162C25]">{repo.name}</p>
                                                        <p className="text-xs text-[#162C25]/40">{repo.owner.login}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className="text-[#162C25]/20 group-hover:text-[#162C25] transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {view === "issues" && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="outline" size="sm" onClick={() => setView("repos")} className="rounded-xl border-[#162C25]/10 text-[#162C25]/60">
                                        Back to Repos
                                    </Button>
                                    <Button size="sm" onClick={() => setView("create-issue")} className="rounded-xl bg-[#162C25] text-[#C8F064] hover:bg-[#162C25]/90">
                                        <Plus size={16} className="mr-2" /> New Issue
                                    </Button>
                                    <Button size="sm" onClick={() => setView("create-pr")} className="rounded-xl bg-[#C8F064] text-[#162C25] hover:bg-[#B8E054]">
                                        <GitPullRequest size={16} className="mr-2" /> New PR
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        onClick={() => {
                                            if (selectedRepo) {
                                                router.push(`/dashboard/canvas/${selectedRepo.owner.login}/${selectedRepo.name}`);
                                            }
                                        }} 
                                        className="rounded-xl bg-[#162C25] text-white hover:bg-[#162C25]/80"
                                    >
                                        <ExternalLink size={16} className="mr-2" /> Move to Canvas
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#162C25]/30">Open Issues</h3>
                                    {loading ? (
                                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="animate-spin text-[#162C25]/20" size={40} />
                                        </div>
                                    ) : issues.length === 0 ? (
                                        <div className="py-12 text-center bg-[#F2F9F1] rounded-[2rem] border border-[#162C25]/5">
                                            <p className="text-sm font-bold text-[#162C25]/40">No open issues found.</p>
                                        </div>
                                    ) : (
                                        issues.map(issue => (
                                            <a
                                                key={issue.id}
                                                href={issue.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start justify-between p-5 rounded-2xl border border-[#162C25]/5 hover:border-[#162C25]/20 transition-all text-left group"
                                            >
                                                <div className="flex gap-4">
                                                    <CircleDot size={18} className="text-emerald-500 mt-1 shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-[#162C25] group-hover:text-[#162C25]/80 line-clamp-2">{issue.title}</p>
                                                        <p className="text-xs text-[#162C25]/40 mt-1">#{issue.number} by {issue.user.login}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-[#162C25]/20 group-hover:text-[#162C25] mt-1" />
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {(view === "create-issue" || view === "create-pr") && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <Button variant="link" onClick={() => setView("issues")} className="p-0 text-[#162C25]/40 hover:text-[#162C25]">
                                    ← Back to Issues
                                </Button>

                                {formSuccess ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-[#C8F064]/20 flex items-center justify-center text-[#162C25]">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-[#162C25]">{formSuccess}</h4>
                                            <p className="text-sm text-[#162C25]/50">Redirecting back to issues...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={view === "create-issue" ? handleCreateIssue : handleCreatePR} className="space-y-6">
                                        {formError && (
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium">
                                                <AlertCircle size={18} />
                                                {formError}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-[#162C25]/40">Title</Label>
                                            <Input name="title" required placeholder={view === "create-issue" ? "Issue title" : "PR title"} className="h-14 rounded-2xl bg-[#F2F9F1] border-none" />
                                        </div>

                                        {view === "create-pr" && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-[#162C25]/40">Head (branch)</Label>
                                                    <Input name="head" required placeholder="feature/branch" className="h-14 rounded-2xl bg-[#F2F9F1] border-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-[#162C25]/40">Base (branch)</Label>
                                                    <Input name="base" required defaultValue="main" className="h-14 rounded-2xl bg-[#F2F9F1] border-none" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-[#162C25]/40">Body / Description</Label>
                                            <textarea
                                                name="body"
                                                required
                                                rows={4}
                                                placeholder="Detailed description..."
                                                className="w-full p-5 rounded-2xl bg-[#F2F9F1] border-none focus:ring-2 focus:ring-[#162C25]/5 min-h-[120px] resize-none text-sm"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={formLoading}
                                            className="w-full h-14 rounded-2xl bg-[#162C25] text-[#C8F064] font-black tracking-tight text-lg hover:shadow-xl hover:shadow-[#162C25]/10 transition-all"
                                        >
                                            {formLoading ? <Loader2 className="animate-spin" /> : (view === "create-issue" ? "Create Issue" : "Create Pull Request")}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
