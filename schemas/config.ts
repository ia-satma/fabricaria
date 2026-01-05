
import { z } from "zod";

export const SystemConfigSchema = z.object({
    projectName: z.string().min(3, "Mínimo 3 caracteres"),
    maxBudget: z.number().min(0, "Debe ser positivo"),
    aiAgentMode: z.enum(["Genesis", "Audit", "Kaizen"]),
    maintenanceMode: z.boolean().default(false)
});

export type SystemConfig = z.infer<typeof SystemConfigSchema>;
