
import { db } from "../src/db/index";
import { users, shiftLogs, breakdowns } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding Analytics Dummy Data...");

    // Get an Operator User for "Created By"
    const operator = await db.query.users.findFirst({
        where: eq(users.role, "operator"),
    });

    if (!operator) {
        console.error("No operator found! Run seed-rbac.ts first.");
        process.exit(1);
    }

    // 1. Generate 30 days of Shift Logs
    console.log("Generating 30 days of Shift Logs...");
    const logs = [];
    const boilers = ["Boiler 1", "Boiler 2"];
    const shifts = ["A", "B", "C"];

    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Random data
        const fuel = Math.floor(Math.random() * (800 - 400) + 400); // 400-800 kg
        const pressure = (Math.random() * (10.5 - 8.5) + 8.5).toFixed(1); // 8.5 - 10.5 bar

        logs.push({
            date: dateStr,
            shift: shifts[i % 3] as "A" | "B" | "C",
            boilerId: boilers[i % 2],
            startTime: "08:00",
            endTime: "16:00",
            steamPressure: `${pressure} bar`,
            fuelType: "Coal",
            fuelConsumed: `${fuel} kg`,
            operatorName: operator.name, // Use operator name
            createdById: operator.id,
            blowdownPerformed: i % 5 === 0, // occasional blowdown
        });
    }

    // Insert Logs
    await db.insert(shiftLogs).values(logs);

    // 2. Generate Breakdowns
    console.log("Generating Breakdowns...");
    const breakdownReasons = [
        "Tube Leakage",
        "Feed Pump Failure",
        "FD Fan Vibration",
        "Grate Jamming",
        "Safety Valve Leak"
    ];

    const breakdownEntries = [];
    for (let i = 0; i < 8; i++) {
        const reason = breakdownReasons[Math.floor(Math.random() * breakdownReasons.length)];
        const downtime = Math.floor(Math.random() * 120) + 30; // 30-150 mins

        breakdownEntries.push({
            boilerId: boilers[Math.floor(Math.random() * boilers.length)],
            issueDescription: reason,
            downtimeMinutes: downtime,
            actionTaken: "Replaced component and tested.",
            createdById: operator.id,
        });
    }

    await db.insert(breakdowns).values(breakdownEntries);

    console.log("Seeding complete! Charts should now have data.");
    process.exit(0);
}

main();
