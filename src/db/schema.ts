
import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    date,
    jsonb,
} from "drizzle-orm/pg-core";

// ... (existing code, I will append new tables below)

// --- Users Table (for Manual Auth) ---
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(), // Hashed password
    role: text("role", { enum: ["operator", "manager", "engineer", "shift_incharge"] }).notNull().default("operator"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Attendance Table ---
export const attendance = pgTable("attendance", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    date: date("date").notNull(), // Stores YYYY-MM-DD
    shift: text("shift", { enum: ["A", "B", "C"] }).notNull(),
    boilerId: text("boiler_id").notNull(),
    checkInTime: timestamp("check_in_time").defaultNow().notNull(),
});

// --- Boiler Shift Logs (Core Feature) ---
export const shiftLogs = pgTable("shift_logs", {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    shift: text("shift", { enum: ["A", "B", "C"] }).notNull(),
    boilerId: text("boiler_id").notNull(),

    // Readings
    startTime: text("start_time").notNull(), // HH:mm
    endTime: text("end_time").notNull(), // HH:mm

    // Steam Parameters
    steamPressure: text("steam_pressure").notNull(),
    steamTemp: text("steam_temp"), // Optional

    // New: Steam Flow Meter Readings (for Generation calc)
    steamFlowStart: text("steam_flow_start").notNull().default("0"),
    steamFlowEnd: text("steam_flow_end").notNull().default("0"),

    fuelType: text("fuel_type").notNull(),
    fuelConsumed: text("fuel_consumed").notNull(),
    blowdownPerformed: boolean("blowdown_performed").notNull().default(false),

    // Metadata
    operatorName: text("operator_name").notNull(), // Snapshot of name
    remarks: text("remarks"),

    // Audit
    createdById: integer("created_by_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Breakdown Logs ---
export const breakdowns = pgTable("breakdowns", {
    id: serial("id").primaryKey(),
    boilerId: text("boiler_id").notNull(),
    issueDescription: text("issue_description").notNull(),

    // Updated Breakdown Logic
    startTime: timestamp("start_time").defaultNow().notNull(), // When reported
    endTime: timestamp("end_time"), // When resolved (Nullable = Active)
    status: text("status", { enum: ["active", "resolved"] }).notNull().default("active"),

    // Legacy / Calculated fields
    downtimeMinutes: integer("downtime_minutes"), // Calculated upon resolution
    actionTaken: text("action_taken"), // Provided upon resolution

    // Audit
    createdById: integer("created_by_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Dynamic Form Config (Engineer) ---
export const formFields = pgTable("form_fields", {
    id: serial("id").primaryKey(),
    label: text("label").notNull(),
    key: text("key").notNull(),
    type: text("type", { enum: ["text", "number", "select"] }).notNull(),
    unit: text("unit"),
    required: boolean("required").default(true),
    order: integer("order").default(0),
    isActive: boolean("is_active").default(true),
});

// --- Hourly Logs ---
export const hourlyLogs = pgTable("hourly_logs", {
    id: serial("id").primaryKey(),
    shiftLogId: integer("shift_log_id").references(() => shiftLogs.id).notNull(),
    loggedAt: timestamp("logged_at").defaultNow().notNull(),
    readingTime: text("reading_time"), // The hour this reading belongs to (HH:mm)
    readings: jsonb("readings").notNull(),
    recordedById: integer("recorded_by_id").references(() => users.id).notNull(),
});
