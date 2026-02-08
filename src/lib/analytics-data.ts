
import { db } from "@/db";
import { shiftLogs, breakdowns } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function getFuelConsumptionStats() {
    try {
        const logs = await db
            .select({
                date: shiftLogs.date,
                fuel: shiftLogs.fuelConsumed,
                boilerId: shiftLogs.boilerId,
            })
            .from(shiftLogs)
            .orderBy(desc(shiftLogs.date))
            .limit(30);

        const processed = logs.map(log => {
            // Handle potential null/undefined log.fuel
            const fuelStr = log.fuel || "0";
            const fuelVal = parseFloat(fuelStr.replace(/[^0-9.]/g, "")) || 0;
            return {
                date: new Date(log.date).toLocaleDateString(),
                fuel: fuelVal,
                boiler: log.boilerId,
            };
        });

        return processed.reverse();
    } catch (error) {
        console.error("Fetch Fuel Stats Error:", error);
        return [];
    }
}

export async function getBreakdownStats() {
    try {
        const logs = await db
            .select({
                boilerId: breakdowns.boilerId,
                downtime: breakdowns.downtimeMinutes,
            })
            .from(breakdowns);

        const grouped: Record<string, number> = {};
        logs.forEach(log => {
            if (log.boilerId) {
                grouped[log.boilerId] = (grouped[log.boilerId] || 0) + 1;
            }
        });

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    } catch (error) {
        console.error("Fetch Breakdown Stats Error:", error);
        return [];
    }
}

export async function getPressureTrends() {
    try {
        const logs = await db
            .select({
                date: shiftLogs.date,
                pressure: shiftLogs.steamPressure,
            })
            .from(shiftLogs)
            .orderBy(desc(shiftLogs.date))
            .limit(30);

        return logs.map(log => {
            const pStr = log.pressure || "0";
            return {
                date: new Date(log.date).toLocaleDateString(),
                pressure: parseFloat(pStr.replace(/[^0-9.]/g, "")) || 0,
            };
        }).reverse();
    } catch (error) {
        console.error("Fetch Pressure Trends Error:", error);
        return [];
    }
}

export async function getSteamGenerationStats() {
    try {
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
            const startStr = log.start || "0";
            const endStr = log.end || "0";
            const s = parseFloat(startStr.replace(/[^0-9.]/g, "") || "0");
            const e = parseFloat(endStr.replace(/[^0-9.]/g, "") || "0");
            const generation = Math.max(0, e - s);
            return {
                date: new Date(log.date).toLocaleDateString(),
                generation,
                boiler: log.boilerId,
            };
        }).reverse();
    } catch (error) {
        console.error("Fetch Steam Stats Error:", error);
        return [];
    }
}
