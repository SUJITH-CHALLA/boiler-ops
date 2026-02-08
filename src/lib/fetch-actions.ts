
"use server";

import { getHourlyLogs } from "@/lib/data";

export async function fetchHourlyLogs(shiftLogId: number) {
    return await getHourlyLogs(shiftLogId);
}
