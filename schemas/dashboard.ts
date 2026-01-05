
import { z } from "zod";

/**
 * PASO 312: EL CONTRATO DE VALIDACIÓN
 * Protocolo: Schema-First para evitar explosiones en la UI.
 */

export const MetricSchema = z.object({
    label: z.string(),
    value: z.string().or(z.number()),
    change: z.number().optional(),
    trend: z.enum(["up", "down", "neutral"]).optional()
});

export const DashboardDataSchema = z.object({
    metrics: z.array(MetricSchema),
    lastUpdate: z.string()
});

export type Metric = z.infer<typeof MetricSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
