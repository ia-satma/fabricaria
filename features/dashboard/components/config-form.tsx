
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SystemConfigSchema, type SystemConfig } from "@/schemas/config";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * PASO 314: FORMULARIOS AUTO-GESTIONADOS
 * Integración de React Hook Form + Zod + Shadcn/UI.
 */

export function ConfigForm({ initialData }: { initialData?: Partial<SystemConfig> }) {
    const form = useForm<SystemConfig>({
        resolver: zodResolver(SystemConfigSchema),
        defaultValues: {
            projectName: initialData?.projectName || "Fabricaria Core",
            maxBudget: initialData?.maxBudget || 100,
            aiAgentMode: initialData?.aiAgentMode || "Genesis",
            maintenanceMode: initialData?.maintenanceMode ?? false
        }
    });

    async function onSubmit(values: SystemConfig) {
        console.log("🚀 [Config] Saving system parameters:", values);
        // Aquí llamaríamos a una Server Action para persistir
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 cyber-card p-6">
                <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-mono text-primary">Project Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-background/50 border-primary/20" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="maxBudget"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-mono text-primary">Monthly Budget ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-background/50 border-primary/20" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="aiAgentMode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-mono text-primary">Cognitive Mode</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50 border-primary/20">
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-card border-primary/20">
                                        <SelectItem value="Genesis">Genesis (Creation)</SelectItem>
                                        <SelectItem value="Audit">Audit (Security)</SelectItem>
                                        <SelectItem value="Kaizen">Kaizen (Optimization)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-primary/10 p-4 bg-background/30">
                            <div className="space-y-0.5">
                                <FormLabel className="font-mono text-primary">Maintenance Mode</FormLabel>
                                <FormDescription className="text-xs">
                                    Enables global read-only lock for agents.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-mono shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    APPLY_PROTOCOL_CHANGES
                </Button>
            </form>
        </Form>
    );
}
