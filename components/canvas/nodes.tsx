import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { 
  GitCommit, 
  CircleDot, 
  GitPullRequest, 
  PlayCircle, 
  ShieldAlert, 
  Tag, 
  User,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  MessageSquare,
  Trash2
} from "lucide-react";

const NodeContainer = ({ children, className = "", selected = false }: { children: React.ReactNode, className?: string, selected?: boolean }) => (
  <div className={`p-4 rounded-2xl border bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(22,44,37,0.08)] transition-all duration-300 ${selected ? 'border-[#162C25] ring-2 ring-[#162C25]/10 scale-105 shadow-[0_20px_50px_rgba(22,44,37,0.15)]' : 'border-[#162C25]/5'} ${className}`}>
    {children}
  </div>
);

export const CommitNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[280px]">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#F2F9F1] flex items-center justify-center text-[#162C25]">
        <GitCommit size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40">{data.sha.substring(0, 7)}</span>
          <span className="text-[10px] font-bold text-[#162C25]/40 flex items-center gap-1">
            <Clock size={10} /> {new Date(data.commit.author.date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm font-bold text-[#162C25] truncate">{data.commit.message}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 rounded-full bg-[#C8F064] flex items-center justify-center text-[8px] font-black">
            {data.commit.author.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-[#162C25]/60">{data.commit.author.name}</span>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const IssueNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[280px] border-l-4 border-l-emerald-500">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
        <CircleDot size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Issue #{data.number}</span>
          <div className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-700">
            {data.state}
          </div>
        </div>
        <p className="text-sm font-black text-[#162C25] leading-snug">{data.title}</p>
        <div className="flex items-center gap-2 mt-3">
          <img src={data.user.avatar_url} className="w-5 h-5 rounded-full border border-[#162C25]/10" alt="" />
          <span className="text-xs font-bold text-[#162C25]/50">{data.user.login}</span>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const PRNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[300px] border-l-4 border-l-purple-500">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
        <GitPullRequest size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600/60">PR #{data.number}</span>
            {data.aiAnalysis && (
              <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                data.aiAnalysis.riskScore > 70 ? 'bg-red-500 text-white' : 
                data.aiAnalysis.riskScore > 30 ? 'bg-amber-400 text-[#162C25]' : 'bg-emerald-400 text-[#162C25]'
              }`}>
                Risk: {data.aiAnalysis.riskScore}
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#162C25]/40">{data.base.ref} ← {data.head.ref}</span>
        </div>
        <p className="text-sm font-black text-[#162C25] leading-snug">{data.title}</p>
        
        {data.aiAnalysis && selected && (
          <div className="mt-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-purple-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-600">AI Architecture Insights</span>
            </div>
            <ul className="space-y-1.5">
              {data.aiAnalysis.suggestions.map((s: string, i: number) => (
                <li key={i} className="text-[10px] font-medium text-[#162C25]/70 flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 overflow-hidden">
          {data.requested_reviewers?.map((r: any) => (
            <img key={r.id} src={r.avatar_url} title={r.login} className="w-5 h-5 rounded-full border border-white -ml-1 first:ml-0" alt="" />
          ))}
          <span className="text-[10px] font-bold text-[#162C25]/40 ml-1">
            {data.draft ? "Draft" : "Review Pending"}
          </span>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const WorkflowNode = memo(({ data, selected }: any) => {
  const isRunning = data.status === "in_progress" || data.status === "queued";
  const isSuccess = data.conclusion === "success";
  const isFailure = data.conclusion === "failure";

  return (
    <NodeContainer selected={selected} className={`min-w-[260px] ${isRunning ? 'animate-pulse' : ''}`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isRunning ? 'bg-blue-50 text-blue-600' : 
          isSuccess ? 'bg-emerald-50 text-emerald-600' : 
          isFailure ? 'bg-red-50 text-red-600' : 'bg-[#F2F9F1] text-[#162C25]'
        }`}>
          {isRunning ? <PlayCircle size={20} className="animate-spin-slow" /> : 
           isSuccess ? <CheckCircle2 size={20} /> : 
           isFailure ? <XCircle size={20} /> : <PlayCircle size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#162C25]/40">Action</span>
            <div className="flex items-center gap-1.5">
               {data.aiPrediction && (
                 <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                    <Zap size={8} className="text-amber-500 fill-amber-500" />
                    <span className="text-[8px] font-black text-amber-700">{data.aiPrediction.probability}% Fail</span>
                 </div>
               )}
               <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                isRunning ? 'bg-blue-100 text-blue-700' : 
                isSuccess ? 'bg-emerald-100 text-emerald-700' : 
                isFailure ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
               }`}>
                {data.status.replace('_', ' ')}
               </span>
            </div>
          </div>
          <p className="text-xs font-black text-[#162C25] truncate">{data.name}</p>
          <p className="text-[10px] font-medium text-[#162C25]/50 mt-1 truncate">{data.display_title}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </NodeContainer>
  );
});

export const DependabotNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[280px] border-2 border-amber-500 bg-amber-50/50">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
        <ShieldAlert size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Security Alert</span>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
            data.security_advisory.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-200 text-amber-800'
          }`}>
            {data.security_advisory.severity}
          </div>
        </div>
        <p className="text-xs font-black text-[#162C25] leading-snug">{data.security_advisory.summary}</p>
        <div className="mt-2 text-[10px] font-bold text-amber-700/60">
          Package: {data.dependency.package.name} ({data.dependency.version || 'vulnerable'})
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const ReleaseNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[280px] border-2 border-[#162C25] bg-[#162C25] text-white">
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#C8F064] flex items-center justify-center text-[#162C25]">
        <Tag size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C8F064]">Release</span>
          <span className="text-[10px] font-bold text-white/40">{new Date(data.published_at).toLocaleDateString()}</span>
        </div>
        <p className="text-sm font-black text-white">{data.tag_name}</p>
        <p className="text-xs font-medium text-white/60 truncate mt-1">{data.name || "Production Build"}</p>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const AIRecapNode = memo(({ data, selected }: any) => (
  <NodeContainer selected={selected} className="min-w-[320px] bg-[#162C25] text-white overflow-hidden relative border-none">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C8F064]/20 to-transparent rounded-bl-[4rem]" />
    <Handle type="target" position={Position.Top} className="opacity-0" />
    <div className="flex items-start gap-4 relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-[#C8F064] flex items-center justify-center text-[#162C25] shadow-lg shadow-[#C8F064]/20">
        <Sparkles size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8F064]">Gemini Executive Briefing</span>
            <span className="text-[10px] font-bold text-white/40">Analysis Complete</span>
        </div>
        <p className="text-sm font-medium leading-relaxed italic text-white/90">
            "{data.summary}"
        </p>
        <div className="mt-4 flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-black uppercase tracking-widest">
                Source: {data.count} Commits
            </div>
            <div className="h-0.5 flex-1 bg-white/5" />
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </NodeContainer>
));

export const CommentNode = memo(({ data, selected }: any) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const text = data.text || "";

  React.useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <NodeContainer selected={selected} className="min-w-[300px] border-2 border-dashed border-[#C8F064] bg-[#F2F9F1]/80 shadow-2xl">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#C8F064] flex items-center justify-center text-[#162C25] shadow-lg shadow-[#C8F064]/20">
          <MessageSquare size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#162C25]/40">{data.author || "System Growth Lead"}</span>
              <span className="text-[8px] font-bold text-[#162C25]/20 uppercase">Interactive Context</span>
          </div>
          <p className="text-xs font-bold leading-relaxed text-[#162C25] whitespace-pre-wrap">
              {displayedText}
              <span className="inline-block w-1.5 h-4 bg-[#C8F064] ml-1 animate-pulse" />
          </p>
          <div className="mt-4 pt-3 border-t border-[#162C25]/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-[#162C25]/30 uppercase tracking-widest">
                  <Zap size={10} className="text-[#C8F064] fill-[#C8F064]" />
                  Priority Insight
              </div>
              <div className="text-[8px] font-bold text-[#162C25]/20 italic">
                  Right-click to remove
              </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </NodeContainer>
  );
});
