"use server";

import { db } from "@/db";
import { shiftLogs } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitShiftLog(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = parseInt(session.user.id);

    // Extract fields
    const boilerId = formData.get("boilerId") as string;
    const shift = formData.get("shift") as "A" | "B" | "C";
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const steamPressure = formData.get("steamPressure") as string;
    const steamTemp = formData.get("steamTemp") as string;
    const steamFlowStart = formData.get("steamFlowStart") as string;
    const steamFlowEnd = formData.get("steamFlowEnd") as string;
    const fuelType = formData.get("fuelType") as string;
    const fuelConsumed = formData.get("fuelConsumed") as string;
    const blowdownPerformed = formData.get("blowdownPerformed") === "on";
    const remarks = formData.get("remarks") as string;
    const date = new Date().toISOString().split("T")[0];

    // Simple Validation
    if (!boilerId || !shift || !startTime || !endTime || !steamPressure || !fuelType || !fuelConsumed || !steamFlowStart || !steamFlowEnd) {
        return { error: "Please fill in all mandatory fields." };
    }

    try {
        await db.insert(shiftLogs).values({
            createdById: userId,
            operatorName: session.user.name || "Unknown",
            date,
            shift,
            boilerId,
            startTime,
            endTime,
            steamPressure,
            steamTemp,
            steamFlowStart,
            steamFlowEnd,
            fuelType,
            fuelConsumed,
            blowdownPerformed,
            remarks,
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Shift Log Error:", error);
        return { error: "Failed to submit log entry." };
    }
}
