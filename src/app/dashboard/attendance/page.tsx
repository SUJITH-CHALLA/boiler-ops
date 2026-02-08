import { auth } from "@/auth";
import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AttendanceSheet } from "./attendance-client";

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string, shift?: string }> }) {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;

    // Strict Access Control: Only Shift Incharge, English, Manager
    if (role === "operator" || !role) {
        redirect("/dashboard");
    }

    // Await searchParams in Next.js 15+
    const params = await searchParams;
    const date = params.date || new Date().toISOString().split("T")[0];
    const shift = (params.shift as "A" | "B" | "C") || "A";

    // maximize query efficiency
    const [allUsers, attendanceRecords] = await Promise.all([
        db.select({ id: users.id, name: users.name, role: users.role }).from(users).orderBy(users.role),
        db.select().from(attendance).where(
            and(
                eq(attendance.date, date),
                eq(attendance.shift, shift)
            )
        )
    ]);

    const presentIds = attendanceRecords.map(a => a.userId);

    return (
        <AttendanceSheet
            users={allUsers}
            presentIds={presentIds}
            role={role}
        />
    );
}
