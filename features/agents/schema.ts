import { z } from "zod";

export const createAgentSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters"),
    role: z
        .string()
        .min(3, "Role must be at least 3 characters")
        .max(100, "Role must be less than 100 characters"),
    objective: z
        .string()
        .min(10, "Objective must be at least 10 characters")
        .max(500, "Objective must be less than 500 characters"),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
