
"use server";

import { db } from "@/db";
import { formFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function addFormField(formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "engineer") return { error: "Unauthorized" };

    const label = formData.get("label") as string;
    const type = formData.get("type") as "text" | "number" | "select";
    const unit = formData.get("unit") as string;

    if (!label || !type) return { error: "Label and Type are required" };

    const key = label.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");

    try {
        await db.insert(formFields).values({
            label,
            key,
            type,
            unit,
            isActive: true,
        });
        revalidatePath("/dashboard/admin/form-builder");
        revalidatePath("/dashboard/operator/hourly");
        return { success: true };
    } catch (error) {
        console.error("Add Field Error:", error);
        return { error: "Failed to add field" };
    }
}

export async function deleteFormField(id: number) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "engineer") return { error: "Unauthorized" };

    try {
        await db.delete(formFields).where(eq(formFields.id, id));
        revalidatePath("/dashboard/admin/form-builder");
        revalidatePath("/dashboard/operator/hourly");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete field" };
    }
}

export async function toggleFormField(id: number, status: boolean) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "engineer") return { error: "Unauthorized" };

    try {
        await db.update(formFields).set({ isActive: status }).where(eq(formFields.id, id));
        revalidatePath("/dashboard/admin/form-builder");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update field" };
    }
}
