
import { db } from "../src/db/index";
import { users } from "../src/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding Utility Access Control (RBAC) Users...");

    const password = await bcrypt.hash("password123", 10);

    const usersList = [
        // 1. Utility Manager (Full Access)
        { name: "Utility Manager", email: "manager@boiler.com", role: "manager" },

        // 2. Utility Engineer (Full Access)
        { name: "Utility Engineer", email: "engineer@boiler.com", role: "engineer" },

        // 3. Shift In-Charges (Can View Records)
        { name: "Shift A In-Charge", email: "shiftA-incharge@boiler.com", role: "shift_incharge" },
        { name: "Shift B In-Charge", email: "shiftB-incharge@boiler.com", role: "shift_incharge" },
        { name: "Shift C In-Charge", email: "shiftC-incharge@boiler.com", role: "shift_incharge" },

        // 4. Operators (Forms Only)
        { name: "Shift A Operator", email: "shiftA-operator@boiler.com", role: "operator" },
        { name: "Shift B Operator", email: "shiftB-operator@boiler.com", role: "operator" },
        { name: "Shift C Operator", email: "shiftC-operator@boiler.com", role: "operator" },
    ];

    for (const u of usersList) {
        // Check if user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, u.email),
        });

        if (!existingUser) {
            await db.insert(users).values({
                name: u.name,
                email: u.email,
                password: password,
                role: u.role as "operator" | "manager" | "engineer" | "shift_incharge",
            });
            console.log(`Created: ${u.role} -> ${u.email}`);
        } else {
            console.log(`Skipping: ${u.email} (Already exists)`);
        }
    }

    console.log("Seeding complete! Initial password for all accounts is 'password123'");
    process.exit(0);
}

main();
