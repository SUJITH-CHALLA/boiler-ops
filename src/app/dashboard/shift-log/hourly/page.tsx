
import { db } from "@/db";
import { formFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HourlyLogForm } from "@/components/forms/hourly-log-form";
import { getRecentAllHourlyLogs } from "@/lib/data";

export default async function HourlyLogPage() {
    const fields = await db.select().from(formFields).where(eq(formFields.isActive, true)).orderBy(formFields.order);
    const recentLogs = await getRecentAllHourlyLogs(5);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hourly Data Entry</h1>
                <p className="text-muted-foreground mt-2">
                    Record readings for the current hour. Ensure accuracy as this data is used for shift averages.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <HourlyLogForm fields={fields} />

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Recent Entries</h2>
                    {recentLogs.length === 0 ? (
                        <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
                            No hourly logs recorded recently.
                        </div>
                    ) : (
                        <div className="border rounded-md bg-white overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Time</th>
                                        <th className="px-3 py-2 text-left">Boiler</th>
                                        <th className="px-3 py-2 text-left">Operator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLogs.map((log) => (
                                        <tr key={log.id} className="border-t hover:bg-muted/50">
                                            <td className="px-3 py-2 font-medium">
                                                {log.readingTime || new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <div className="text-[10px] text-muted-foreground">{new Date(log.loggedAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-3 py-2">{log.boilerId} <span className="text-xs text-muted-foreground">({log.shift})</span></td>
                                            <td className="px-3 py-2">{log.recordedBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
