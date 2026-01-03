import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";
import { getAgents } from "@/features/agents/actions";
import { AgentsPageClient } from "@/features/agents/AgentsPageClient";

export default async function AgentsPage() {
    const agents = await getAgents();

    return (
        <div className="min-h-screen bg-background cyber-grid">
            <div className="border-b border-primary/20">
                <div className="container flex h-16 items-center px-4">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold font-mono">Agent Control Panel</h1>
                    </div>
                    <div className="ml-auto">
                        <Link href="/">
                            <Button variant="ghost" className="font-mono">← BACK TO HOME</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-8 px-4">
                {agents.length === 0 ? (
                    <Card className="cyber-card">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Bot className="h-16 w-16 text-primary/50 mb-4" />
                            <h2 className="text-xl font-mono font-bold mb-2">No Agents Deployed</h2>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                Your factory is waiting. Deploy your first autonomous agent to begin production.
                            </p>
                            <Button className="font-mono">
                                <Plus className="mr-2 h-4 w-4" />
                                DEPLOY FIRST AGENT
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <AgentsPageClient initialAgents={agents} />
                )}
            </div>
        </div>
    );
}
