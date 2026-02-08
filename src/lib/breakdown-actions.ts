"use server";

import { db } from "@/db";
import { breakdowns } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function submitBreakdown(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = parseInt(session.user.id);

    const boilerId = formData.get("boilerId") as string;
    const issueDescription = formData.get("issueDescription") as string;
    // Optional custom start time, default to NOW in DB if not provided
    // const startTime = formData.get("startTime") as string; 

    if (!boilerId || !issueDescription) {
        return { error: "Please fill in all mandatory fields." };
    }

    try {
        await db.insert(breakdowns).values({
            createdById: userId,
            boilerId,
            issueDescription,
            status: "active",
            // startTime defaults to Now() in DB
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/breakdown");
        return { success: true };
    } catch (error) {
        console.error("Breakdown Log Error:", error);
        return { error: "Failed to submit breakdown report." };
    }
}

export async function resolveBreakdown(breakdownId: number, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const endTime = formData.get("endTime") as string;
    const actionTaken = formData.get("actionTaken") as string;

    if (!endTime || !actionTaken) return { error: "End Time and Action Taken are required." };

    try {
        // Calculate minutes difference
        // We need start time to calculate accurately, but we can do it in app or just store endTime
        // Let's fetch start time first? Or just update endTime and let UI/Analysis calculate diff.
        // Schema has downtimeMinutes as integer. We should calculate it.

        const record = await db.query.breakdowns.findFirst({
            where: eq(breakdowns.id, breakdownId)
        });

        if (!record) return { error: "Record not found" };

        const start = new Date(record.startTime);
        const end = new Date(endTime); // ISO string from Input datetime-local?
        // Wait, input datetime-local returns "YYYY-MM-DDTHH:mm".
        // record.startTime is Date object from DB.

        const diffMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

        await db.update(breakdowns)
            .set({
                endTime: end,
                actionTaken,
                status: "resolved",
                downtimeMinutes: diffMinutes > 0 ? diffMinutes : 0
            })
            .where(eq(breakdowns.id, breakdownId));

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/breakdown");
        return { success: true };
    } catch (error) {
        console.error("Resolve Error:", error);
        return { error: "Failed to resolve breakdown." };
    }
}
