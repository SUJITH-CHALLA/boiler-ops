import {
    sqliteTable,
    text,
    integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// --- Users Table (for Manual Auth) ---
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(), // Hashed password
    role: text("role", { enum: ["operator", "supervisor"] }).notNull().default("operator"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// --- Attendance Table ---
export const attendance = sqliteTable("attendance", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").references(() => users.id).notNull(),
    date: text("date").notNull(), // Stores YYYY-MM-DD
    shift: text("shift", { enum: ["A", "B", "C"] }).notNull(),
    boilerId: text("boiler_id").notNull(),
    checkInTime: integer("check_in_time", { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// --- Boiler Shift Logs (Core Feature) ---
export const shiftLogs = sqliteTable("shift_logs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull(),
    shift: text("shift", { enum: ["A", "B", "C"] }).notNull(),
    boilerId: text("boiler_id").notNull(),

    // Readings
    startTime: text("start_time").notNull(), // HH:mm
    endTime: text("end_time").notNull(), // HH:mm
    steamPressure: text("steam_pressure").notNull(),
    steamTemp: text("steam_temp"), // Optional
    fuelType: text("fuel_type").notNull(),
    fuelConsumed: text("fuel_consumed").notNull(),
    blowdownPerformed: integer("blowdown_performed", { mode: 'boolean' }).notNull().default(false),

    // Metadata
    operatorName: text("operator_name").notNull(), // Snapshot of name
    remarks: text("remarks"),

    // Audit
    createdById: integer("created_by_id").references(() => users.id).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// --- Breakdown Logs ---
export const breakdowns = sqliteTable("breakdowns", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    boilerId: text("boiler_id").notNull(),
    issueDescription: text("issue_description").notNull(),
    downtimeMinutes: integer("downtime_minutes").notNull(),
    actionTaken: text("action_taken").notNull(),

    // Audit
    createdById: integer("created_by_id").references(() => users.id).notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});
