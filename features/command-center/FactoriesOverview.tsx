"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users } from "lucide-react";

interface Factory {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  location: string;
  workers: number;
  output: number;
}

interface FactoriesOverviewProps {
  factories: Factory[];
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "idle":
      return "secondary";
    case "error":
      return "destructive";
    default:
      return "outline";
  }
}

function formatOutput(output: number) {
  if (output >= 1000) {
    return `${(output / 1000).toFixed(1)}k`;
  }
  return output.toString();
}

export function FactoriesOverview({ factories }: FactoriesOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Factories Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.map((factory) => (
            <Card key={factory.id} className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{factory.name}</h3>
                  <Badge variant={getStatusVariant(factory.status)}>
                    {factory.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{factory.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{factory.workers} workers</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Output</span>
                      <span className="font-mono font-bold">{formatOutput(factory.output)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
