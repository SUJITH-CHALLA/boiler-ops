
import { db } from "@/db";
import { shiftLogs, breakdowns } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function getFuelConsumptionStats() {
    const logs = await db
        .select({
            date: shiftLogs.date,
            fuel: shiftLogs.fuelConsumed,
            boilerId: shiftLogs.boilerId,
        })
        .from(shiftLogs)
        .orderBy(desc(shiftLogs.date))
        .limit(30); // Last 30 entries

    // Process data (since fuel is stored as text, e.g. "500 kg")
    // We'll try to extract the number.
    const processed = logs.map(log => {
        const fuelVal = parseFloat(log.fuel.replace(/[^0-9.]/g, "")) || 0;
        return {
            date: new Date(log.date).toLocaleDateString(),
            fuel: fuelVal,
            boiler: log.boilerId,
        };
    });

    // Group by date if multiple boilers
    // Simpler approach: return raw points for now, or group by day.
    // Let's reverse to show chronological order
    return processed.reverse();
}

export async function getBreakdownStats() {
    const logs = await db
        .select({
            boilerId: breakdowns.boilerId,
            downtime: breakdowns.downtimeMinutes,
        })
        .from(breakdowns);

    // Group by Boiler ID
    const grouped: Record<string, number> = {};
    logs.forEach(log => {
        grouped[log.boilerId] = (grouped[log.boilerId] || 0) + 1;
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

export async function getPressureTrends() {
    const logs = await db
        .select({
            date: shiftLogs.date,
            pressure: shiftLogs.steamPressure,
        })
        .from(shiftLogs)
        .orderBy(desc(shiftLogs.date))
        .limit(30);

    return logs.map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        pressure: parseFloat(log.pressure.replace(/[^0-9.]/g, "")) || 0,
    })).reverse();
}

export async function getSteamGenerationStats() {
    const logs = await db
        .select({
            date: shiftLogs.date,
            start: shiftLogs.steamFlowStart,
            end: shiftLogs.steamFlowEnd,
            boilerId: shiftLogs.boilerId,
        })
        .from(shiftLogs)
        .orderBy(desc(shiftLogs.date))
        .limit(30);

    return logs.map(log => {
        const s = parseFloat(log.start?.replace(/[^0-9.]/g, "") || "0");
        const e = parseFloat(log.end?.replace(/[^0-9.]/g, "") || "0");
        const generation = Math.max(0, e - s);
        return {
            date: new Date(log.date).toLocaleDateString(),
            generation,
            boiler: log.boilerId,
        };
    }).reverse();
}
