import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Box, Layers, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
                        Protocolo Génesis Activado
                    </div>
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Build software <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            at the speed of thought.
                        </span>
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        The opinionated scaffolding for high-performance SaaS.
                        Engineered for engineers who value aesthetics, speed, and type safety.
                    </p>
                    <div className="space-x-4">
                        <Button size="lg" className="h-11 px-8">
                            Start Building
                        </Button>
                        <Button variant="outline" size="lg" className="h-11 px-8">
                            Documentation
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <Card className="flex flex-col justify-between p-2">
                        <CardContent className="pt-6">
                            <Zap className="h-12 w-12 mb-4 text-yellow-500" />
                            <h3 className="text-lg font-bold">Lightning Fast</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Powered by Next.js 14 Server Components and optimistic UI patterns.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between p-2">
                        <CardContent className="pt-6">
                            <Layers className="h-12 w-12 mb-4 text-blue-500" />
                            <h3 className="text-lg font-bold">Type Safe</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                End-to-end type safety with TypeScript, Drizzle ORM, and Zod.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between p-2">
                        <CardContent className="pt-6">
                            <Box className="h-12 w-12 mb-4 text-purple-500" />
                            <h3 className="text-lg font-bold">FSD Lite</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Pre-configured Feature-Sliced Design architecture for scalability.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
