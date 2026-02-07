
import { db } from "../src/db/index";
import { users } from "../src/db/schema";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Seeding database...");

    const password = await bcrypt.hash("password123", 10);

    try {
        await db.insert(users).values([
            {
                name: "Admin Supervisor",
                email: "supervisor@boilerops.internal",
                password: password,
                role: "supervisor",
            },
            {
                name: "Operator John",
                email: "operator@boilerops.internal",
                password: password,
                role: "operator",
            },
        ]);
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }

    process.exit(0);
}

main();
