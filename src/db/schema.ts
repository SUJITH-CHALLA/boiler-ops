
import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    date,
} from "drizzle-orm/pg-core";

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
