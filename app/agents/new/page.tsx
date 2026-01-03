import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { CreateAgentForm } from "@/features/agents/CreateAgentForm";

export default function NewAgentPage() {
    return (
        <div className="min-h-screen bg-background cyber-grid">
            <div className="border-b border-primary/20">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold font-mono">New Agent</h1>
                    </div>
                    <div className="ml-auto">
                        <Link href="/agents">
                            <Button variant="ghost" className="font-mono">← BACK TO AGENTS</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4">
                <CreateAgentForm />
            </div>
        </div>
    );
}
