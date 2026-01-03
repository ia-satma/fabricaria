"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface SystemEvent {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: "info" | "success" | "warning" | "error";
}

interface SystemTimelineProps {
  events: SystemEvent[];
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function getSeverityBg(severity: string) {
  switch (severity) {
    case "success":
      return "bg-green-500/10 border-green-500/20";
    case "warning":
      return "bg-orange-500/10 border-orange-500/20";
    case "error":
      return "bg-red-500/10 border-red-500/20";
    default:
      return "bg-blue-500/10 border-blue-500/20";
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function SystemTimeline({ events }: SystemTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          System Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6 pb-6">
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityBg(event.severity)}`}
              >
                <div className="mt-0.5">{getSeverityIcon(event.severity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(event.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
