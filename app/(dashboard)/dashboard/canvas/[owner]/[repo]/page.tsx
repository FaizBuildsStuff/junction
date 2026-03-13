import React from "react";
import CanvasClient from "@/components/canvas/CanvasClient";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = await params;

  return (
    <div className="h-[calc(100vh-2rem)] w-full overflow-hidden rounded-[2.5rem] bg-[#F2F9F1]/30 border border-[#162C25]/5 relative">
      <CanvasClient owner={owner} repo={repo} />
    </div>
  );
}
