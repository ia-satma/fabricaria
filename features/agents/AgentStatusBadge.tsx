"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentStatus } from "./types";

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

const statusConfig: Record<AgentStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-green-500/20 text-green-500 border-green-500/30 hover:bg-green-500/30",
  },
  booting: {
    label: "Booting",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30",
  },
  idle: {
    label: "Idle",
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30",
  },
};

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      <span className={cn(
        "mr-1.5 h-2 w-2 rounded-full",
        status === "active" && "bg-green-500 animate-pulse",
        status === "booting" && "bg-yellow-500 animate-pulse",
        status === "failed" && "bg-red-500",
        status === "idle" && "bg-gray-400"
      )} />
      {config.label}
    </Badge>
  );
}
