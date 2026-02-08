"use server";
import { db } from "@/db";
import { shiftLogs, hourlyLogs, formFields } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function submitHourlyLog(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // @ts-ignore
    const role = session.user.role;
    if (role === "manager") {
        return { error: "Managers have view-only access." };
    }

    const boilerId = formData.get("boilerId") as string;
    const shift = formData.get("shift") as "A" | "B" | "C";
    const date = new Date().toISOString().split("T")[0];

    // Get Active Custom Fields
    const fields = await db.select().from(formFields).where(eq(formFields.isActive, true));

    const readings: Record<string, any> = {};
    for (const field of fields) {
        const val = formData.get(field.key);
        // Basic validation
        if (field.required && (!val || val.toString().trim() === "")) {
            return { error: `Missing required field: ${field.label}` };
        }
        // Sanitize Input (prevent excessive length or non-string/number)
        const strVal = val ? String(val).slice(0, 500) : "";
        readings[field.key] = strVal;
    }

    try {
        // Ensure Shift Log exists (Draft or Active)
        let shiftLog = await db.query.shiftLogs.findFirst({
            where: and(
                eq(shiftLogs.date, date),
                eq(shiftLogs.shift, shift),
                eq(shiftLogs.boilerId, boilerId)
            )
        });

        if (!shiftLog) {
            // Create Draft Shift Log to attach hourly logs to
            const [newLog] = await db.insert(shiftLogs).values({
                createdById: parseInt(session.user.id),
                operatorName: session.user.name || "Unknown Operator",
                date,
                shift,
                boilerId,
                startTime: new Date().toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
                endTime: "", // Pending
                steamPressure: "0", // Default to 0 instead of empty string to avoid integer conversion errors later? Strings are fine.
                steamTemp: "",
                fuelType: "Coal", // Default
                fuelConsumed: "0",
                steamFlowStart: "0",
                steamFlowEnd: "0",
                blowdownPerformed: false,
                remarks: "Auto-created by Hourly Log",
            }).returning();

            if (!newLog) throw new Error("Failed to initialize Shift Log header.");
            shiftLog = newLog;
        }

        const readingTime = formData.get("readingTime") as string || new Date().toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });

        await db.insert(hourlyLogs).values({
            shiftLogId: shiftLog.id,
            readings: readings,
            readingTime: readingTime,
            recordedById: parseInt(session.user.id),
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/shift-log/hourly");
        return { success: true };
    } catch (error) {
        console.error("Hourly Log Error:", error);
        return { error: error instanceof Error ? error.message : "Failed to save hourly log." };
    }
}

export async function submitShiftLog(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = parseInt(session.user.id);
    // @ts-ignore
    const role = session.user.role;

    if (role !== "shift_incharge" && role !== "engineer") {
        return { error: "Unauthorized: Only Shift Incharges or Engineers can submit summaries." };
    }

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

export async function updateShiftLog(id: number, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    // @ts-ignore
    const role = session.user.role;
    if (role !== "shift_incharge" && role !== "engineer") {
        return { error: "Unauthorized: Only Shift Incharges or Engineers can edit logs." };
    }

    try {
        await db.update(shiftLogs).set({
            boilerId: formData.get("boilerId") as string,
            shift: formData.get("shift") as "A" | "B" | "C",
            startTime: formData.get("startTime") as string,
            endTime: formData.get("endTime") as string,
            steamPressure: formData.get("steamPressure") as string,
            steamTemp: formData.get("steamTemp") as string,
            steamFlowStart: formData.get("steamFlowStart") as string,
            steamFlowEnd: formData.get("steamFlowEnd") as string,
            fuelType: formData.get("fuelType") as string,
            fuelConsumed: formData.get("fuelConsumed") as string,
            blowdownPerformed: formData.get("blowdownPerformed") === "on",
            remarks: formData.get("remarks") as string,
        }).where(eq(shiftLogs.id, id));

        revalidatePath("/dashboard/records");
        return { success: true };
    } catch (error) {
        console.error("Update Log Error:", error);
        return { error: "Failed to update log." };
    }
}
