
import { db } from "../src/db/index";
import { users, attendance, shiftLogs, hourlyLogs, breakdowns } from "../src/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    console.log("Seeding today's detailed data (2026-02-08)...");

    const todayDate = "2026-02-08";

    // 1. Clear existing generic dummy data (optional but requested "remove all dummy data")
    // Caution: This deletes operational history.
    console.log("Cleaning old operational logs...");
    await db.delete(hourlyLogs);
    await db.delete(attendance);
    await db.delete(breakdowns);
    await db.delete(shiftLogs);

    // 2. Ensure we have users. We need at least 21 for the attendance part if we want 7 unique per shift.
    // Let's create some if they don't exist.
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create 21 "Staff" users for the demo if not enough exist
    const staffNames = [
        "James Smith", "Maria Garcia", "Robert Johnson", "Patricia Miller", "Michael Young", "Linda King", "William Wright",
        "Elizabeth Scott", "David Nguyen", "Jennifer Green", "Richard Hill", "Susan Adams", "Joseph Baker", "Margaret Nelson",
        "Charles Carter", "Dorothy Mitchell", "Thomas Perez", "Lisa Roberts", "Christopher Turner", "Nancy Phillips", "Daniel Campbell"
    ];

    console.log("Checking/Creating 21 staff users...");
    const userIds: number[] = [];

    for (let i = 0; i < staffNames.length; i++) {
        const name = staffNames[i];
        const email = `${name.toLowerCase().replace(/\s+/g, ".")}@boiler.internal`;

        let user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            const [newUser] = await db.insert(users).values({
                name,
                email,
                password: hashedPassword,
                role: "operator"
            }).returning({ id: users.id });
            userIds.push(newUser.id);
            console.log(`Created staff: ${name}`);
        } else {
            userIds.push(user.id);
        }
    }

    // 3. Add Attendance (7 per shift)
    console.log("Logging attendance for 21 staff members...");
    const shifts: ("A" | "B" | "C")[] = ["A", "B", "C"];
    for (let s = 0; s < shifts.length; s++) {
        const shift = shifts[s];
        const shiftStaff = userIds.slice(s * 7, (s + 1) * 7);

        for (const userId of shiftStaff) {
            await db.insert(attendance).values({
                userId,
                date: todayDate,
                shift,
                boilerId: "B1",
                checkInTime: new Date(`${todayDate}T${s === 0 ? "06:00:00" : s === 1 ? "14:00:00" : "22:00:00"}`)
            });
        }
    }

    // 4. Create 3 Shift Logs (one per shift)
    console.log("Creating 3 shift summaries...");
    const managers = await db.query.users.findMany({ where: eq(users.role, "manager") });
    const inchargeId = managers[0]?.id || userIds[0];

    const shiftA = await db.insert(shiftLogs).values({
        date: todayDate,
        shift: "A",
        boilerId: "B1",
        startTime: "06:00",
        endTime: "14:00",
        steamPressure: "10.5 Bar",
        steamTemp: "185 C",
        steamFlowStart: "15240",
        steamFlowEnd: "16890",
        fuelType: "Coal/Wood",
        fuelConsumed: "450 Kg",
        operatorName: "Utility Incharge A",
        createdById: inchargeId,
        remarks: "Smooth operation, standard parameters maintained."
    }).returning({ id: shiftLogs.id });

    const shiftB = await db.insert(shiftLogs).values({
        date: todayDate,
        shift: "B",
        boilerId: "B1",
        startTime: "14:00",
        endTime: "22:00",
        steamPressure: "10.2 Bar",
        steamTemp: "182 C",
        steamFlowStart: "16890",
        steamFlowEnd: "18450",
        fuelType: "Coal/Wood",
        fuelConsumed: "480 Kg",
        operatorName: "Utility Incharge B",
        createdById: inchargeId,
        remarks: "Handover completed. Minor fluctuation in steam flow at 16:00."
    }).returning({ id: shiftLogs.id });

    const shiftC = await db.insert(shiftLogs).values({
        date: todayDate,
        shift: "C",
        boilerId: "B1",
        startTime: "22:00",
        endTime: "06:00",
        steamPressure: "10.8 Bar",
        steamTemp: "188 C",
        steamFlowStart: "18450",
        steamFlowEnd: "19920",
        fuelType: "Coal/Wood",
        fuelConsumed: "420 Kg",
        operatorName: "Utility Incharge C",
        createdById: inchargeId,
        remarks: "Night shift completed. No issues reported."
    }).returning({ id: shiftLogs.id });

    // 5. Add Hourly Logs for each shift
    console.log("Populating hourly readings...");
    const shiftsData = [
        { id: shiftA[0].id, start: 6, count: 8 },
        { id: shiftB[0].id, start: 14, count: 8 },
        { id: shiftC[0].id, start: 22, count: 8 },
    ];

    for (const sData of shiftsData) {
        for (let h = 0; h < sData.count; h++) {
            const hour = (sData.start + h) % 24;
            const hourDate = new Date(`${todayDate}T${hour.toString().padStart(2, '0')}:00:00`);

            await db.insert(hourlyLogs).values({
                shiftLogId: sData.id,
                loggedAt: hourDate,
                recordedById: userIds[h % userIds.length],
                readings: {
                    steam_pressure: (10 + Math.random()).toFixed(2),
                    water_level: "Normal",
                    fuel_feed: "Steady",
                    flue_temp: (150 + Math.random() * 20).toFixed(0)
                }
            });
        }
    }

    console.log("Seeding complete! Today's data is ready.");
    process.exit(0);
}

main().catch(err => {
    console.error("Seeding Failed:", err);
    process.exit(1);
});
