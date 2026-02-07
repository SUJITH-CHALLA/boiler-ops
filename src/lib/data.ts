
import { db } from "@/db";
import { shiftLogs, attendance, breakdowns } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getShiftLogs(limit = 20) {
    try {
        return await db.select().from(shiftLogs).orderBy(desc(shiftLogs.date)).limit(limit);
    } catch (error) {
        console.error("Fetch Shift Logs Error:", error);
        return [];
    }
}

export async function getAttendanceRecords(limit = 20) {
    try {
        return await db.select().from(attendance).orderBy(desc(attendance.date)).limit(limit);
    } catch (error) {
        console.error("Fetch Attendance Error:", error);
        return [];
    }
}

export async function getBreakdownLogs(limit = 20) {
    try {
        return await db.select().from(breakdowns).orderBy(desc(breakdowns.createdAt)).limit(limit);
    } catch (error) {
        console.error("Fetch Breakdown Error:", error);
        return [];
    }
}
