import { pgTable, text, serial, timestamp, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id),
    email: text("email").notNull().unique(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
    isActive: boolean("is_active").default(true),
});

export const subscriptions = pgTable("subscriptions", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id),
    plan: text("plan").notNull(),
    status: text("status").notNull(), // 'active', 'canceled'
    currentPeriodEnd: timestamp("current_period_end"),
});

export const agentMemories = pgTable("agent_memories", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
    content: text("content").notNull(),
    // For vector type, we use a raw sql helper or custom type if supported, 
    // currently we'll define it as a generic type for documentation in schema.ts
    // and handle actual creation via migration.
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow(),
});
