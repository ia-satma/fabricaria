"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentsTable } from "./AgentsTable";
import { DeployAgentButton } from "./DeployAgentButton";
import { ChevronDown, Filter } from "lucide-react";
import type { Agent, AgentStatus } from "./types";

interface AgentsPageClientProps {
    initialAgents: Agent[];
}

const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "booting", label: "Booting" },
    { value: "failed", label: "Failed" },
    { value: "idle", label: "Idle" },
] as const;

export function AgentsPageClient({ initialAgents }: AgentsPageClientProps) {
    const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");

    const selectedLabel = statusOptions.find((opt) => opt.value === statusFilter)?.label;

    return (
        <Card className="cyber-card">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 font-mono">
                        <span>Agents</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            ({initialAgents.length} total)
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
                <AgentsTable agents={initialAgents} statusFilter={statusFilter} />
            </CardContent>
        </Card>
    );
}
