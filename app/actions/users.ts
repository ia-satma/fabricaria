"use server";

import { db } from "@/db";
import { users, tenants, agentMemories } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function getUsers() {
    try {
        const allUsers = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                createdAt: users.createdAt,
                isActive: users.isActive,
                tenantName: tenants.name,
            })
            .from(users)
            .leftJoin(tenants, eq(users.tenantId, tenants.id))
            .orderBy(desc(users.createdAt))
            .limit(100);

        return { success: true, data: allUsers };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function getDashboardStats() {
    try {
        const [userCount] = await db.select({ count: count() }).from(users);
        const [tenantCount] = await db.select({ count: count() }).from(tenants);
        const [memoryCount] = await db.select({ count: count() }).from(agentMemories);

        const activeUsers = await db
            .select({ count: count() })
            .from(users)
            .where(eq(users.isActive, true));

        return {
            success: true,
            data: {
                totalUsers: userCount.count,
                totalTenants: tenantCount.count,
                totalMemories: memoryCount.count,
                activeUsers: activeUsers[0].count,
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function createUser(data: {
    email: string;
    name: string;
    tenantId?: string;
}) {
    try {
        const [newUser] = await db
            .insert(users)
            .values({
                email: data.email,
                name: data.name,
                tenantId: data.tenantId || null,
                isActive: true,
            })
            .returning();

        return { success: true, data: newUser };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Failed to create user" };
    }
}
