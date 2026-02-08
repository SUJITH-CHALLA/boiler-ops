
import { db } from "@/db";
import { shiftLogs, attendance, breakdowns, hourlyLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

import { users } from "@/db/schema";

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
        return await db.select({
            id: attendance.id,
            date: attendance.date,
            shift: attendance.shift,
            boilerId: attendance.boilerId,
            checkInTime: attendance.checkInTime,
            userName: users.name
        })
            .from(attendance)
            .leftJoin(users, eq(attendance.userId, users.id))
            .orderBy(desc(attendance.date))
            .limit(limit);
    } catch (error) {
        console.error("Fetch Attendance Error:", error);
        return [];
    }
}

export async function getBreakdownLogs(limit = 20) {
    try {
        return await db.select({
            id: breakdowns.id,
            boilerId: breakdowns.boilerId,
            issueDescription: breakdowns.issueDescription,
            downtimeMinutes: breakdowns.downtimeMinutes,
            actionTaken: breakdowns.actionTaken,
            status: breakdowns.status,
            createdAt: breakdowns.createdAt,
            reportedBy: users.name
        })
            .from(breakdowns)
            .leftJoin(users, eq(breakdowns.createdById, users.id))
            .orderBy(desc(breakdowns.createdAt))
            .limit(limit);
    } catch (error) {
        console.error("Fetch Breakdown Error:", error);
        return [];
    }
}
// ... existing code ...

export async function getHourlyLogs(shiftLogId: number) {
    try {
        return await db.select({
            id: hourlyLogs.id,
            loggedAt: hourlyLogs.loggedAt,
            readingTime: hourlyLogs.readingTime,
            readings: hourlyLogs.readings,
            recordedBy: users.name
        })
            .from(hourlyLogs)
            .leftJoin(users, eq(hourlyLogs.recordedById, users.id))
            .where(eq(hourlyLogs.shiftLogId, shiftLogId))
            .orderBy(desc(hourlyLogs.loggedAt));
    } catch (error) {
        console.error("Fetch Hourly Logs Error:", error);
        return [];
    }
}

export async function getRecentAllHourlyLogs(limit = 10) {
    try {
        return await db.select({
            id: hourlyLogs.id,
            loggedAt: hourlyLogs.loggedAt,
            readingTime: hourlyLogs.readingTime, // stored as string "HH:mm"
            readings: hourlyLogs.readings,
            recordedBy: users.name,
            boilerId: shiftLogs.boilerId,
            shift: shiftLogs.shift,
            date: shiftLogs.date,
        })
            .from(hourlyLogs)
            .leftJoin(users, eq(hourlyLogs.recordedById, users.id))
            .leftJoin(shiftLogs, eq(hourlyLogs.shiftLogId, shiftLogs.id))
            .orderBy(desc(hourlyLogs.loggedAt))
            .limit(limit);
    } catch (error) {
        console.error("Fetch Recent Hourly Logs Error:", error);
        return [];
    }
}
