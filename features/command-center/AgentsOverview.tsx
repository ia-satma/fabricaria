"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Circle } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "running" | "idle" | "error" | "deploying";
  factoryId: string;
}

interface AgentsOverviewProps {
  agents?: Agent[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "running":
      return "text-green-500";
    case "idle":
      return "text-gray-400";
    case "error":
      return "text-red-500";
    case "deploying":
      return "text-blue-500";
    default:
      return "text-gray-400";
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "running":
      return "success";
    case "idle":
      return "secondary";
    case "error":
      return "destructive";
    case "deploying":
      return "default";
    default:
      return "outline";
  }
}

const mockAgents: Agent[] = [
  { id: "1", name: "CodeGen-Alpha", type: "Generator", status: "running", factoryId: "1" },
  { id: "2", name: "DataProcessor-01", type: "Processor", status: "running", factoryId: "1" },
  { id: "3", name: "Validator-Prime", type: "Validator", status: "running", factoryId: "1" },
  { id: "4", name: "Orchestrator-Main", type: "Orchestrator", status: "running", factoryId: "1" },
  { id: "5", name: "CodeGen-Beta", type: "Generator", status: "running", factoryId: "2" },
  { id: "6", name: "DataProcessor-02", type: "Processor", status: "idle", factoryId: "2" },
  { id: "7", name: "TestRunner-Alpha", type: "Tester", status: "running", factoryId: "1" },
  { id: "8", name: "TestRunner-Beta", type: "Tester", status: "error", factoryId: "2" },
  { id: "9", name: "Deployer-Main", type: "Deployer", status: "idle", factoryId: "1" },
  { id: "10", name: "Monitor-01", type: "Monitor", status: "running", factoryId: "1" },
  { id: "11", name: "Monitor-02", type: "Monitor", status: "running", factoryId: "2" },
  { id: "12", name: "NewAgent-Gamma", type: "Generator", status: "deploying", factoryId: "1" },
];

export function AgentsOverview({ agents = mockAgents }: AgentsOverviewProps) {
  const runningCount = agents.filter((a) => a.status === "running").length;
  const errorCount = agents.filter((a) => a.status === "error").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agents Overview
          </div>
          <div className="flex gap-2 text-sm font-normal">
            <Badge variant="success">{runningCount} running</Badge>
            {errorCount > 0 && (
              <Badge variant="destructive">{errorCount} error</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Circle className={`h-2 w-2 fill-current ${getStatusColor(agent.status)}`} />
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.type}</p>
                </div>
              </div>
              <Badge variant={getStatusBadge(agent.status) as any} className="text-xs">
                {agent.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
