import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlobalMetricsBar } from "@/features/command-center/GlobalMetricsBar";
import { FactoriesOverview } from "@/features/command-center/FactoriesOverview";
import { AgentsOverview } from "@/features/command-center/AgentsOverview";
import { SystemTimeline } from "@/features/command-center/SystemTimeline";

const mockGlobalMetrics = {
  totalFactories: 3,
  totalAgents: 12,
  systemHealth: 97.5,
  activeAlerts: 2,
};

const mockFactories = [
  { id: "1", name: "Factory Alpha", status: "active" as const, location: "US-East", workers: 8, output: 12847 },
  { id: "2", name: "Factory Beta", status: "active" as const, location: "EU-West", workers: 5, output: 8932 },
  { id: "3", name: "Factory Gamma", status: "idle" as const, location: "AP-South", workers: 0, output: 0 },
];

const mockEvents = [
  { id: "1", type: "agent_deployed", message: "CodeGen-Alpha deployed successfully", timestamp: new Date(), severity: "info" as const },
  { id: "2", type: "alert", message: "High CPU usage on DataProcessor-01", timestamp: new Date(Date.now() - 600000), severity: "warning" as const },
  { id: "3", type: "factory_started", message: "Factory Beta came online", timestamp: new Date(Date.now() - 3600000), severity: "success" as const },
  { id: "4", type: "error", message: "Agent TestRunner-Beta failed to start", timestamp: new Date(Date.now() - 7200000), severity: "error" as const },
  { id: "5", type: "agent_deployed", message: "Monitor-02 deployed to Factory Beta", timestamp: new Date(Date.now() - 10800000), severity: "info" as const },
  { id: "6", type: "factory_started", message: "Factory Alpha scaled to 8 workers", timestamp: new Date(Date.now() - 14400000), severity: "success" as const },
];

export default function CommandCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Command Center</h1>
          <div className="ml-auto">
            <Link href="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8 px-4 space-y-8">
        <GlobalMetricsBar metrics={mockGlobalMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FactoriesOverview factories={mockFactories} />
          </div>
          <div>
            <SystemTimeline events={mockEvents} />
          </div>
        </div>

        <AgentsOverview />
      </div>
    </div>
  );
}
