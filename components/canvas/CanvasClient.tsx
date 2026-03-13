"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";

import {
  getGitHubCommits,
  getGitHubIssues,
  getGitHubPRs,
  getGitHubWorkflowRuns,
  getGitHubReleases,
  getGitHubDependabotAlerts,
} from "@/app/actions/github";

import {
  CommitNode,
  IssueNode,
  PRNode,
  WorkflowNode,
  DependabotNode,
  ReleaseNode,
  AIRecapNode,
  CommentNode
} from "./nodes";

import { 
  Loader2, 
  RefreshCcw, 
  LayoutDashboard, 
  Info, 
  Zap,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  ArrowLeft,
  Settings2,
  Clock,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// New specialized components
import ContextMenu from "./ContextMenu";
import RightSidebar from "./RightSidebar";
import CanvasHeader from "./CanvasHeader";
import CreateRepoModal from "./CreateRepoModal";
import CreateIssueModal from "./CreateIssueModal";
import CreatePRModal from "./CreatePRModal";
import CommandPalette from "./CommandPalette";
import { triggerGitHubWorkflow } from "@/app/actions/github";
import { analyzePR, summarizeCommits, predictWorkflowFailure, getProjectBriefing } from "@/app/actions/ai";

const nodeTypes = {
  commit: CommitNode,
  issue: IssueNode,
  pr: PRNode,
  workflow: WorkflowNode,
  dependabot: DependabotNode,
  release: ReleaseNode,
  aiRecap: AIRecapNode,
  comment: CommentNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 320, height: 200 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - 160,
      y: nodeWithPosition.y - 100,
    };

    return node;
  });

  return { nodes, edges };
};

export default function CanvasClient({ owner, repo }: { owner: string; repo: string }) {
  return (
    <ReactFlowProvider>
      <CanvasInner owner={owner} repo={repo} />
    </ReactFlowProvider>
  );
}

function CanvasInner({ owner, repo }: { owner: string; repo: string }) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Power Feature States
  const [menu, setMenu] = useState<{ x: number; y: number; node: any } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);

  // Time Machine States
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [automationSettings, setAutomationSettings] = useState({
    autoPush: true,
    issueGated: false,
    realTimeSync: true,
    aiAnalysis: true,
  });

  // ShortCut Listener for CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [analytics, setAnalytics] = useState({
    commits: 0,
    issues: 0,
    prs: 0,
    activeWorkflows: 0,
    alerts: 0
  });

  const storageKey = `junction-pos-v1-${owner}-${repo}`;

  const savePositions = useCallback((nodes: Node[]) => {
    const positions = nodes.reduce((acc, node) => {
        acc[node.id] = node.position;
        return acc;
    }, {} as Record<string, { x: number, y: number }>);
    localStorage.setItem(storageKey, JSON.stringify(positions));
  }, [storageKey]);

  const loadPositions = useCallback(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }, [storageKey]);

  const onNodeDragStop = useCallback((_: any, node: Node) => {
    setNodes(nds => {
        const updated = nds.map(n => n.id === node.id ? node : n);
        savePositions(updated);
        return updated;
    });
  }, [savePositions, setNodes]);

  const fetchData = useCallback(async (isSilent = false, forceLayout = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [commits, issues, prs, workflows, releases, alerts] = await Promise.all([
        getGitHubCommits(owner, repo),
        getGitHubIssues(owner, repo),
        getGitHubPRs(owner, repo),
        getGitHubWorkflowRuns(owner, repo),
        getGitHubReleases(owner, repo),
        getGitHubDependabotAlerts(owner, repo),
      ]);

      let aiSummary = "";
      let growthAdvice = "";
      let analyzedPRs = prs;
      let analyzedWorkflows = workflows.workflow_runs || [];

      // AI Orchestration
      if (automationSettings.aiAnalysis) {
        console.log("Junction AI: Orchestrating Architecture Analysis...");
        const aiPromises: Promise<any>[] = [
            summarizeCommits(commits.slice(0, 15)),
            getProjectBriefing(repo, commits)
        ];

        // Analyze first 3 PRs
        prs.slice(0, 3).forEach((pr: any) => {
            aiPromises.push(analyzePR(pr));
        });

        // Predict failure for the most recent workflow if it's running
        if (analyzedWorkflows.length > 0) {
            aiPromises.push(predictWorkflowFailure(analyzedWorkflows.slice(0, 10)));
        }

        const aiResults = await Promise.all(aiPromises);
        aiSummary = aiResults[0];
        growthAdvice = aiResults[1];
        
        // Map PR results
        analyzedPRs = prs.map((pr: any, idx: number) => {
            if (idx < 3) return { ...pr, aiAnalysis: aiResults[idx + 1] };
            return pr;
        });

        // Map Workflow results
        if (analyzedWorkflows.length > 0) {
            const prediction = aiResults[aiResults.length - 1];
            analyzedWorkflows = analyzedWorkflows.map((run: any, idx: number) => {
                if (idx === 0) return { ...run, aiPrediction: prediction };
                return run;
            });
        }
      }

      const newNodes: any[] = [];
      const newEdges: any[] = [];

      // Add AI Recap Node if summary exists
      if (aiSummary) {
          newNodes.push({
              id: 'ai-recap',
              type: 'aiRecap',
              data: { summary: aiSummary, count: commits.length },
              position: { x: 0, y: -200 }
          });
      }

      // Add Growth Comment Node if advice exists
      if (growthAdvice) {
          newNodes.push({
              id: 'ai-growth-comment',
              type: 'comment',
              data: { 
                  text: growthAdvice, 
                  author: "System Strategy Lead"
              },
              position: { x: 400, y: -200 }
          });
      }

      // Create Commit Nodes & Edges
      commits.forEach((commit: any, idx: number) => {
        newNodes.push({
          id: `commit-${commit.sha}`,
          type: "commit",
          data: commit,
          position: { x: 0, y: 0 },
        });
        if (idx < commits.length - 1) {
          newEdges.push({
            id: `e-commit-${idx}`,
            source: `commit-${commits[idx + 1].sha}`,
            target: `commit-${commit.sha}`,
            animated: true,
            style: { stroke: "#162C25", strokeWidth: 2, strokeDasharray: "5 5" },
          });
        }
      });

      // Issue Nodes
      issues.forEach((issue: any) => {
        newNodes.push({
          id: `issue-${issue.id}`,
          type: "issue",
          data: issue,
          position: { x: 0, y: 0 },
        });
      });

      // PR Nodes (Using AI Analyzed Data)
      analyzedPRs.forEach((pr: any) => {
        newNodes.push({
          id: `pr-${pr.id}`,
          type: "pr",
          data: pr,
          position: { x: 0, y: 0 },
        });
      });

      // Workflow Nodes (Using AI Analyzed Data)
      analyzedWorkflows.slice(0, 5).forEach((run: any) => {
        newNodes.push({
          id: `workflow-${run.id}`,
          type: "workflow",
          data: run,
          position: { x: 0, y: 0 },
        });
      });

      // Alert Nodes
      alerts.forEach((alert: any) => {
        newNodes.push({
          id: `alert-${alert.number}`,
          type: "dependabot",
          data: alert,
          position: { x: 0, y: 0 },
        });
      });

      // Release Nodes
      releases.forEach((release: any) => {
        newNodes.push({
          id: `release-${release.id}`,
          type: "release",
          data: release,
          position: { x: 0, y: 0 },
        });
      });

      setAnalytics({
        commits: commits.length,
        issues: issues.length,
        prs: prs.length,
        activeWorkflows: workflows.total_count || 0,
        alerts: alerts.length
      });

      // Apply Layout or Load Positions
      const savedPositions = loadPositions();
      
      const newState: { nodes: Node[], edges: Edge[], analytics: any } = { 
        nodes: [], 
        edges: [], 
        analytics: {
          commits: commits.length,
          issues: issues.length,
          prs: prs.length,
          activeWorkflows: workflows.total_count || 0,
          alerts: alerts.length
        }
      };

      if (forceLayout || !savedPositions) {
          const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
          setNodes([...layoutedNodes]);
          setEdges([...layoutedEdges]);
          newState.nodes = [...layoutedNodes];
          newState.edges = [...layoutedEdges];
          if (!isSilent) savePositions(layoutedNodes);
      } else {
          const nodesWithPositions = newNodes.map(node => ({
              ...node,
              position: savedPositions[node.id] || node.position
          }));
          setNodes([...nodesWithPositions]);
          setEdges([...newEdges]);
          newState.nodes = [...nodesWithPositions];
          newState.edges = [...newEdges];
      }
      
      // Update History
      setHistory(prev => {
          const newHistory = [...prev, newState].slice(-20); // Keep last 20 states
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching canvas data:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [owner, repo, setNodes, setEdges, automationSettings.aiAnalysis]);

  useEffect(() => {
    fetchData();
    // Real-time polling
    const interval = setInterval(() => {
        if (automationSettings.realTimeSync) fetchData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData, automationSettings.realTimeSync]);

  const onHistoryChange = (index: number) => {
    const prevState = history[index];
    if (prevState) {
        setHistoryIndex(index);
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        setAnalytics(prevState.analytics);
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onPaneContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();
      setMenu({ x: event.clientX, y: event.clientY, node: null });
    },
    [setMenu]
  );

  const onNodeContextMenu = useCallback(
    (event: any, node: Node) => {
      event.preventDefault();
      setMenu({ x: event.clientX, y: event.clientY, node });
    },
    [setMenu]
  );

  const onHandleAction = async (action: string, data?: any) => {
    console.log(`Action triggered: ${action}`, data);
    setMenu(null);
    
    // Automation Logic
    if (action === "push" && automationSettings.autoPush) {
        alert("Automation: Changes successfully pushed to GitHub!");
        return;
    }
    
    // Layout Logic
    if (action === "layout") {
        fetchData(true, true);
        return;
    }

    // AI Trigger
    if (action === "trigger-ai") {
        fetchData();
        return;
    }

    // Modal Triggers
    if (action === "add-issue") {
        setIsIssueModalOpen(true);
        return;
    }
    if (action === "add-pr") {
        setIsPRModalOpen(true);
        return;
    }
    if (action === "add-workflow") {
        try {
            // Trigger the most recent workflow or a default one
            setLoading(true);
            const workflows = await getGitHubWorkflowRuns(owner, repo);
            if (workflows.workflow_runs && workflows.workflow_runs.length > 0) {
                const workflowId = workflows.workflow_runs[0].workflow_id;
                await triggerGitHubWorkflow(owner, repo, workflowId);
                alert("Workflow Dispatched Successfully!");
                fetchData(true);
            } else {
                alert("No workflows found to trigger!");
            }
        } catch (err: any) {
            alert(`Workflow Dispatch Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
        return;
    }
    if (action === "add-commit") {
        alert("Commit Block: Commits are usually made via local Git or PR merge. This block helps visualize prospective changes.");
        return;
    }

    if (action === "add-comment") {
        const id = `comment-${Date.now()}`;
        const newNode: Node = {
            id,
            type: "comment",
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { 
                text: "Add your strategic growth insight here...", 
                author: "User Strategy"
            },
        };
        setNodes((nds) => nds.concat(newNode));
        return;
    }

    if (action === "delete-node") {
        const nodeId = data?.id;
        if (nodeId) {
            setNodes(nds => nds.filter(n => n.id !== nodeId));
            setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
        }
        return;
    }
  };

  return (
    <div className="h-full w-full relative" onClick={() => setMenu(null)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#F2F9F1]/20"
      >
        <Background color="#162C25" gap={40} size={1} style={{ opacity: 0.1 }} />
        <Controls className="!bg-white !border-[#162C25]/10 !rounded-xl !shadow-lg hidden md:flex" />
        
        <Panel position="top-left" className="m-6 flex flex-col gap-4">
           <CanvasHeader 
            owner={owner} 
            repo={repo} 
            onOpenCreateModal={() => setIsCreateModalOpen(true)} 
           />
        </Panel>

        <Panel position="top-right" className="m-6 flex flex-col gap-3 items-end">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-[#162C25]/5 shadow-xl hover:bg-white transition-all text-[#162C25]"
              >
                <Settings2 size={24} />
              </button>
              
              <div className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl border border-[#162C25]/5 shadow-lg flex items-center gap-2 group cursor-pointer" onClick={() => fetchData()}>
                <RefreshCcw size={16} className={`text-[#162C25]/60 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-black tracking-widest text-[#162C25]/40 pr-1">
                    {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
           </div>
        </Panel>

        {history.length > 1 && (
            <Panel position="bottom-center" className="mb-12">
                <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-[#162C25]/5 shadow-[0_30px_60px_rgba(22,44,37,0.1)] flex items-center gap-6 min-w-[420px] animate-in slide-in-from-bottom-4 duration-700">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F9F1] flex items-center justify-center text-[#162C25]">
                        <Clock size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#162C25]/40">Time Machine</span>
                            <span className="text-[10px] font-black text-[#162C25]">
                                <span className="text-[#C8F064] bg-[#162C25] px-1.5 py-0.5 rounded-md mr-1">{historyIndex + 1}</span> 
                                <span className="opacity-20">/ {history.length}</span>
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={history.length - 1} 
                            value={historyIndex} 
                            onChange={(e) => onHistoryChange(parseInt(e.target.value))}
                            className="w-full accent-[#162C25] h-1 bg-[#162C25]/5 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </Panel>
        )}

        <Panel position="bottom-right" className="m-8 max-w-[320px] transition-all duration-500" style={{ transform: isSidebarOpen ? 'translateX(-340px)' : 'none' }}>
            <div className="bg-[#162C25] text-white p-8 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-[4rem]" />
                
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 size={20} className="text-[#C8F064]" />
                    <h2 className="text-lg font-black tracking-tight">Repo Analytics</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Commits</p>
                        <p className="text-2xl font-black text-[#C8F064]">{analytics.commits}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Alerts</p>
                        <p className="text-2xl font-black text-red-400">{analytics.alerts}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Active PRs</p>
                        <p className="text-2xl font-black text-white">{analytics.prs}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Actions</p>
                        <p className="text-2xl font-black text-blue-400">{analytics.activeWorkflows}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/60">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Security: Shield On</span>
                    </div>
                    <Zap size={14} className={automationSettings.realTimeSync ? "text-[#C8F064]" : "text-white/20"} />
                </div>
            </div>
        </Panel>

        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-[200] flex flex-col items-center justify-center gap-4">
             <div className="relative">
                <Loader2 className="animate-spin text-[#162C25] opacity-20" size={64} />
                <LayoutDashboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#162C25]" size={24} />
             </div>
             <p className="text-xs font-black text-[#162C25] uppercase tracking-[0.4em]">Engine Initializing...</p>
          </div>
        )}
      </ReactFlow>

      {/* Power Overlays */}
      {menu && (
        <ContextMenu 
          {...menu} 
          onClose={() => setMenu(null)} 
          onAction={onHandleAction}
        />
      )}
      
      <RightSidebar 
        isOpen={isSidebarOpen} 
        automationSettings={automationSettings}
        onSettingChange={(s, v) => setAutomationSettings({...automationSettings, [s]: v})}
        onAddBlock={(type) => onHandleAction(`add-${type}`)}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAction={onHandleAction}
      />

      <CreateRepoModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />

      <CreateIssueModal 
        isOpen={isIssueModalOpen} 
        onOpenChange={setIsIssueModalOpen}
        owner={owner}
        repo={repo}
        onSuccess={() => fetchData(true)}
      />

      <CreatePRModal 
        isOpen={isPRModalOpen} 
        onOpenChange={setIsPRModalOpen}
        owner={owner}
        repo={repo}
        onSuccess={() => fetchData(true)}
      />
    </div>
  );
}
