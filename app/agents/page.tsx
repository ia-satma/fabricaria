"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentsTable } from "@/features/agents/AgentsTable";
import { DeployAgentButton } from "@/features/agents/DeployAgentButton";
import { Bot, ChevronDown, Filter } from "lucide-react";
import type { Agent, AgentStatus } from "@/features/agents/types";

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "CodeGen-Alpha",
    status: "active",
    replId: "repl-abc123",
    url: "https://repl.co/abc",
    tasksCompleted: 1247,
    cpuLoad: 45,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "DataProcessor-01",
    status: "active",
    replId: "repl-def456",
    url: "https://repl.co/def",
    tasksCompleted: 892,
    cpuLoad: 72,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "TestRunner-Beta",
    status: "booting",
    replId: "repl-ghi789",
    url: null,
    tasksCompleted: 0,
    cpuLoad: 0,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Analyzer-Gamma",
    status: "failed",
    replId: "repl-jkl012",
    url: null,
    tasksCompleted: 156,
    cpuLoad: 0,
    createdAt: new Date(),
  },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "booting", label: "Booting" },
  { value: "failed", label: "Failed" },
  { value: "idle", label: "Idle" },
] as const;

export default function AgentsPage() {
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");

  const selectedLabel = statusOptions.find((opt) => opt.value === statusFilter)?.label;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Agent Control Panel</h1>
          </div>
          <div className="ml-auto">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <span>Agents</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({mockAgents.length} total)
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {selectedLabel}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DeployAgentButton />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AgentsTable agents={mockAgents} statusFilter={statusFilter} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
