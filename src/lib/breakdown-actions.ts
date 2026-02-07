"use server";

import { db } from "@/db";
import { breakdowns } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitBreakdown(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = parseInt(session.user.id);

    // Extract fields
    const boilerId = formData.get("boilerId") as string;
    const issueDescription = formData.get("issueDescription") as string;
    const downtimeMinutes = formData.get("downtimeMinutes") as string;
    const actionTaken = formData.get("actionTaken") as string;

    // Validation
    if (!boilerId || !issueDescription || !downtimeMinutes || !actionTaken) {
        return { error: "Please fill in all mandatory fields." };
    }

    try {
        await db.insert(breakdowns).values({
            createdById: userId,
            boilerId,
            issueDescription,
            downtimeMinutes: parseInt(downtimeMinutes),
            actionTaken,
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Breakdown Log Error:", error);
        return { error: "Failed to submit breakdown report." };
    }
}
