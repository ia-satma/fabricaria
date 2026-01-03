"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function DeployAgentButton() {
    return (
        <Link href="/agents/new">
            <Button>
                <Play className="mr-2 h-4 w-4" />
                DEPLOY AGENT
            </Button>
        </Link>
    );
}
