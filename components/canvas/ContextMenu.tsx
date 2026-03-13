"use client";

import React from "react";
import { 
  Upload, 
  Trash2, 
  GitBranch, 
  RefreshCw, 
  Plus, 
  FileCode, 
  PlayCircle 
} from "lucide-react";

export default function ContextMenu({
  x,
  y,
  node,
  onClose,
  onAction,
}: {
  x: number;
  y: number;
  node: any;
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
}) {
  return (
    <div
      className="fixed z-[200] bg-white/90 backdrop-blur-2xl border border-[#162C25]/10 rounded-2xl shadow-[0_20px_50px_rgba(22,44,37,0.2)] p-2 min-w-[200px] animate-in zoom-in-95 duration-200"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      {node ? (
        <>
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 border-b border-[#162C25]/5 mb-1">
            {node.type === 'comment' ? 'Perspective' : node.type} Actions
          </div>
          {node.type !== 'comment' && (
            <>
              <MenuButton 
                icon={<Upload size={16} />} 
                label="Push Changes" 
                onClick={() => onAction("push", node)} 
              />
              <MenuButton 
                icon={<GitBranch size={16} />} 
                label="New Branch from here" 
                onClick={() => onAction("branch", node)} 
              />
              <MenuButton 
                icon={<RefreshCw size={16} />} 
                label="Sync State" 
                onClick={() => onAction("sync", node)} 
              />
            </>
          )}
          <div className="h-px bg-[#162C25]/5 my-1" />
          <MenuButton 
            icon={<Trash2 size={16} />} 
            label={node.type === 'comment' ? "Remove Comment" : "Delete Record"} 
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onAction("delete-node", node)} 
          />
        </>
      ) : (
        <>
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#162C25]/40 border-b border-[#162C25]/5 mb-1">
            Canvas Actions
          </div>
          <MenuButton 
            icon={<Plus size={16} />} 
            label="Add Issue Block" 
            onClick={() => onAction("add-issue")} 
          />
          <MenuButton 
            icon={<FileCode size={16} />} 
            label="Add PR Block" 
            onClick={() => onAction("add-pr")} 
          />
          <MenuButton 
            icon={<GitBranch size={16} />} 
            label="Switch Branch" 
            onClick={() => onAction("switch-branch")} 
          />
          <MenuButton 
            icon={<PlayCircle size={16} />} 
            label="Add Workflow Block" 
            onClick={() => onAction("add-workflow")} 
          />
          <div className="h-px bg-[#162C25]/5 my-1" />
          <MenuButton 
            icon={<RefreshCw size={16} />} 
            label="Re-layout Graph" 
            onClick={() => onAction("layout")} 
          />
        </>
      )}
    </div>
  );
}

function MenuButton({ 
  icon, 
  label, 
  onClick, 
  className = "" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  className?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#162C25] hover:bg-[#F2F9F1] transition-all group ${className}`}
    >
      <span className="text-[#162C25]/40 group-hover:text-inherit">
        {icon}
      </span>
      {label}
    </button>
  );
}
