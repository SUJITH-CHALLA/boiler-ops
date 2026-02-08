
import { db } from "@/db";
import { shiftLogs, attendance, breakdowns } from "@/db/schema";
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
