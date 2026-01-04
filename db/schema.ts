import { pgTable, text, serial, timestamp, boolean, uuid, jsonb, integer, vector } from "drizzle-orm/pg-core";

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
    plan: text("plan").notNull(),
    status: text("status").notNull(), // 'active', 'canceled'
    currentPeriodEnd: timestamp("current_period_end"),
});

export const agentMemories = pgTable("agent_memories", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id),
    content: text("content").notNull(),
    // We use a custom type or sql helper for vector if needed, but for Drizzle schema 
    // we can treat it as a custom type or just document it. 
    // Drizzle now supports custom types, but for simplicity in this setup we'll trust the migration
    // and just define what we can interact with.
    // However, to keep TS happy we might not define it here if we don't read it directly as a standard column often, 
    // or use a custom type helper. 
    // For now, let's leave it out of the ORM definition or use a placeholder if we need to select it.
    // But wait, we can define a custom type:
    // embedding: vector("embedding", { dimensions: 768 }), 
    // Since we don't have the custom vector type helper imported, we will assume it is handled via raw SQL 
    // in the actions. But let's add metadata.
    metadata: jsonb("metadata").default({}),
    embedding: vector("embedding", { dimensions: 768 }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: text("role"),
    objective: text("objective"),
    replId: text("repl_id"),
    url: text("url"),
    status: text("status").default("booting"), // 'booting', 'active', 'failed', 'idle'
    tasksCompleted: integer("tasks_completed").default(0),
    cpuLoad: integer("cpu_load").default(0),
    tenantId: uuid("tenant_id").references(() => tenants.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const analyticsEvents = pgTable("analytics_events", {
    id: uuid("id").primaryKey().defaultRandom(),
    date: timestamp("date").notNull(),
    category: text("category").notNull(),
    value: integer("value").notNull(),
    agentId: uuid("agent_id").references(() => agents.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const learnedPatterns = pgTable("learned_patterns", {
    id: uuid("id").primaryKey().defaultRandom(),
    pattern: text("pattern").notNull(),
    description: text("description"),
    metadata: jsonb("metadata").default({}),
    embedding: vector("embedding", { dimensions: 768 }),
    tenantId: uuid("tenant_id").references(() => tenants.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const fabricationQueue = pgTable("fabrication_queue", {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: text("job_id").notNull(),
    status: text("status").notNull(),
    payload: jsonb("payload").default({}),
    handoffData: jsonb("handoff_data"), // Stores HandoffPacket
    tenantId: uuid("tenant_id").references(() => tenants.id), // RLS Step 26
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const codeAudits = pgTable("code_audits", {
    id: uuid("id").primaryKey().defaultRandom(),
    repoUrl: text("repo_url").notNull(),
    hash: text("hash").notNull(), // SHA-256
    blueprint: jsonb("blueprint").notNull(),
    tenantId: uuid("tenant_id").references(() => tenants.id), // RLS Step 26
    createdAt: timestamp("created_at").defaultNow(),
});

export const securityLogs = pgTable("security_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    actionType: text("action_type").notNull(),
    payload: jsonb("payload").notNull(),
    reason: text("reason").notNull(),
    severity: text("severity").default("high"), // 'low', 'medium', 'high', 'critical'
    tenantId: uuid("tenant_id").references(() => tenants.id), // RLS Step 26
    createdAt: timestamp("created_at").defaultNow(),
});

export const tokenUsageLogs = pgTable("token_usage_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    agentType: text("agent_type").notNull(), // 'RESEARCH', 'CODER', 'QA'
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    costUsd: text("cost_usd").notNull(), // Store as text to avoid float precision issues, or decimal
    contextHash: text("context_hash"),
    tenantId: uuid("tenant_id").references(() => tenants.id), // RLS Step 26
    createdAt: timestamp("created_at").defaultNow(),
});

export const thoughtTraces = pgTable("thought_traces", {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id").notNull(),
    signature: text("signature").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const auditTrail = pgTable("audit_trail", {
    id: uuid("id").primaryKey().defaultRandom(),
    prevHash: text("prev_hash"),
    actionPayload: jsonb("action_payload").notNull(),
    agentThought: text("agent_thought"),
    currentHash: text("current_hash").notNull(),
    timestamp: timestamp("timestamp").defaultNow(),
    tenantId: uuid("tenant_id").references(() => tenants.id),
});

