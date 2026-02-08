
import { db } from "../src/db/index";
import { users, breakdowns } from "../src/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    console.log("Adding 5 breakdown incidents for today...");

    const todayDate = "2026-02-08";
    const manager = await db.query.users.findFirst({ where: eq(users.role, "manager") });
    const incharge = await db.query.users.findFirst({ where: eq(users.role, "shift_incharge") });
    const creatorId = manager?.id || incharge?.id || 1;

    const incidents = [
        {
            boilerId: "B1",
            issueDescription: "Steam leakage at main valve gasket.",
            status: "resolved",
            actionTaken: "Gasket replaced and leak tested.",
            downtimeMinutes: 45,
            createdAt: new Date(`${todayDate}T08:30:00`)
        },
        {
            boilerId: "B1",
            issueDescription: "Feed pump motor overheating.",
            status: "resolved",
            actionTaken: "Cleaned vent and applied lubricant. Cooling fan checked.",
            downtimeMinutes: 30,
            createdAt: new Date(`${todayDate}T10:15:00`)
        },
        {
            boilerId: "B1",
            issueDescription: "FD Fan vibration abnormally high.",
            status: "active",
            createdAt: new Date(`${todayDate}T15:45:00`)
        },
        {
            boilerId: "B1",
            issueDescription: "Coal feeder jamming due to wet fuel.",
            status: "resolved",
            actionTaken: "Cleared jam and manually fed dry coal.",
            downtimeMinutes: 20,
            createdAt: new Date(`${todayDate}T18:20:00`)
        },
        {
            boilerId: "B1",
            issueDescription: "Gauge glass visibility poor.",
            status: "active",
            createdAt: new Date(`${todayDate}T21:10:00`)
        },
    ];

    for (const incident of incidents) {
        await db.insert(breakdowns).values({
            ...incident,
            createdById: creatorId,
        } as any);
    }

    console.log("Success: Added 5 incidents.");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
