"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { Bot, ExternalLink, MoreVertical, RotateCw, Trash2, Eye, ArrowUpDown } from "lucide-react";
import type { Agent, AgentStatus } from "./types";

interface AgentsTableProps {
  agents: Agent[];
  statusFilter: AgentStatus | "all";
}

type SortField = "name" | "status" | "tasksCompleted" | "cpuLoad";
type SortDirection = "asc" | "desc";

export function AgentsTable({ agents, statusFilter }: AgentsTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredAgents = agents.filter((agent) => {
    if (statusFilter === "all") return true;
    return agent.status === statusFilter;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "tasksCompleted":
        comparison = a.tasksCompleted - b.tasksCompleted;
        break;
      case "cpuLoad":
        comparison = a.cpuLoad - b.cpuLoad;
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortableHeader field="name">Name</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="status">Status</SortableHeader>
          </TableHead>
          <TableHead>Repl ID</TableHead>
          <TableHead>
            <SortableHeader field="tasksCompleted">Tasks Completed</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="cpuLoad">CPU Load</SortableHeader>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAgents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              No agents found.
            </TableCell>
          </TableRow>
        ) : (
          sortedAgents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  {agent.name}
                </div>
              </TableCell>
              <TableCell>
                <AgentStatusBadge status={agent.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-muted-foreground">{agent.replId}</code>
                  {agent.url && (
                    <a
                      href={agent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>{agent.tasksCompleted.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        agent.cpuLoad > 80
                          ? "bg-red-500"
                          : agent.cpuLoad > 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${agent.cpuLoad}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{agent.cpuLoad}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RotateCw className="mr-2 h-4 w-4" />
                      Restart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
