"use server";

import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const authSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type AuthState = {
    success?: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
};

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = authSchema.safeParse({ email, password });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors as { [key: string]: string[] },
        };
    }

    try {
        return await db.transaction(async (tx) => {
            // 1. PROTOCOLO AEGIS: Establecer contexto de Tenant para RLS
            // En una app real, esto vendría de la sesión o el dominio.
            // Para este bootstrap, buscamos al usuario primero.

            let existingUser = await tx.query.users.findFirst({
                where: eq(users.email, validatedFields.data.email),
            });

            let tenantId: string;

            if (!existingUser) {
                // Registro automático (Génesis Mode)
                const [newTenant] = await tx.insert(tenants).values({
                    name: `${validatedFields.data.email}'s Org`,
                }).returning();

                tenantId = newTenant.id;

                await tx.insert(users).values({
                    email: validatedFields.data.email,
                    tenantId: tenantId,
                    name: validatedFields.data.email.split("@")[0],
                });
            } else {
                tenantId = existingUser.tenantId!;
            }

            // 2. ACTIVACIÓN RLS: Set config para que Neon aplique las políticas
            // Esto asegura que cualquier consulta posterior en esta transacción esté aislada.
            await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);

            // 3. Simulación de éxito
            return {
                success: true,
                message: "Conexión sináptica establecida correctamente.",
            };
        });
    } catch (error) {
        console.error("Auth Error:", error);
        return {
            success: false,
            message: "Error crítico en el puente de datos.",
        };
    }
}
