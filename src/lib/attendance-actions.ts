
"use server";

import { db } from "@/db";
import { attendance } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function saveBulkAttendance(
    date: string,
    shift: "A" | "B" | "C",
    boilerId: string,
    presentUserIds: number[]
) {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;

    if (role !== "shift_incharge" && role !== "engineer" && role !== "manager") {
        return { message: "Unauthorized", success: false };
    }

    try {
        // 1. Remove existing attendance for this Date + Shift (Simple overwrite strategy)
        // Note: This assumes only one entry per user per shift. 
        // We delete ALL records for this date/shift to handle "Unchecking" (marking absent).
        // However, we should be careful if we have multiple boilerIds. 
        // For simplicity, we assume this bulk sheet covers the entire shift.

        await db.delete(attendance).where(
            and(
                eq(attendance.date, date),
                eq(attendance.shift, shift)
            )
        );

        // 2. Insert new records for present users
        if (presentUserIds.length > 0) {
            const values = presentUserIds.map(userId => ({
                userId,
                date,
                shift,
                boilerId: boilerId || "General",
                checkInTime: new Date(),
            }));

            await db.insert(attendance).values(values);
        }

        revalidatePath("/dashboard/attendance");
        return { message: "Attendance updated successfully", success: true };
    } catch (error) {
        console.error("Attendance Error:", error);
        return { message: "Failed to save attendance", success: false };
    }
}
