import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
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
