
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(2, "Name is required"),
    role: z.enum(["operator", "shift_incharge", "manager", "engineer"]),
});

export async function createUser(startState: any, formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "engineer") {
        return { message: "Unauthorized: Only Engineers can create users." };
    }

    const rawData = {
        name: formData.get("name"),
        role: formData.get("role"),
    };

    const validatedFields = UserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { message: "Invalid fields", errors: validatedFields.error.flatten().fieldErrors };
    }

    const { name, role } = validatedFields.data;

    try {
        // Auto-generate email: name.lowercase.no-spaces@boiler.internal
        const email = `${name.toLowerCase().replace(/\s+/g, ".")}@boiler.internal`;
        const DEFAULT_PASSWORD = "password123";
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            // @ts-ignore
            role: role,
        });
    } catch (error) {
        return { message: "Database Error: User with this name (identifier) might already exist." };
    }

    revalidatePath("/dashboard/admin");
    return { message: "User created successfully!", success: true };
}

import { eq } from "drizzle-orm";

export async function updatePassword(startState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { message: "Not authenticated" };

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!newPassword || newPassword.length < 6) {
        return { message: "New password must be at least 6 characters" };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
        });

        if (!user) return { message: "User not found" };

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return { message: "Incorrect current password" };

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, user.id));

        return { message: "Password updated successfully!", success: true };
    } catch (error) {
        return { message: "Failed to update password." };
    }
}

export async function adminResetPassword(userId: number) {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "engineer") {
        return { message: "Unauthorized" };
    }

    try {
        const defaultPassword = "password123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/admin");
        return { message: "Password reset to 'password123'", success: true };
    } catch (error) {
        return { message: "Failed to reset password." };
    }
}
