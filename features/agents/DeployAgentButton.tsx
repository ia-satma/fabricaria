"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";

interface DeployAgentButtonProps {
  onDeploy?: () => Promise<void>;
}

export function DeployAgentButton({ onDeploy }: DeployAgentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeploy = async () => {
    setIsLoading(true);
    try {
      if (onDeploy) {
        await onDeploy();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDeploy} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Deploy Agent
        </>
      )}
    </Button>
  );
}
