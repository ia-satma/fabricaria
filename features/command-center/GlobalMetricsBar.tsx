"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Bot, Shield, Bell } from "lucide-react";

interface GlobalMetrics {
  totalFactories: number;
  totalAgents: number;
  systemHealth: number;
  activeAlerts: number;
}

interface GlobalMetricsBarProps {
  metrics: GlobalMetrics;
}

export function GlobalMetricsBar({ metrics }: GlobalMetricsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Factories</p>
            <p className="text-2xl font-bold">{metrics.totalFactories}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Bot className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Agents</p>
            <p className="text-2xl font-bold">{metrics.totalAgents}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">System Health</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{metrics.systemHealth}%</p>
              <Progress value={metrics.systemHealth} className="h-2 flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`p-2 rounded-lg ${metrics.activeAlerts > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
            <Bell className={`h-6 w-6 ${metrics.activeAlerts > 0 ? 'text-orange-500' : 'text-green-500'}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <p className={`text-2xl font-bold ${metrics.activeAlerts > 0 ? 'text-orange-500' : 'text-green-500'}`}>
              {metrics.activeAlerts}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
