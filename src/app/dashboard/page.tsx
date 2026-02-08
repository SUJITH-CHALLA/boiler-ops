import { auth, signOut } from "@/auth";
import { getFuelConsumptionStats, getBreakdownStats, getPressureTrends, getSteamGenerationStats } from "@/lib/analytics-data";
import { getBreakdownLogs } from "@/lib/data";
import { FuelChart, BreakdownChart, PressureChart, SteamChart } from "@/components/analytics/Charts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { OperatorView } from "@/components/dashboard/operator-view";

import { InchargeView } from "@/components/dashboard/incharge-view";
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard";

export default async function DashboardPage() {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;
    const isManager = role === "manager";
    const isIncharge = role === "shift_incharge" || role === "engineer";
    const showAnalytics = role !== "operator";

    let fuelData: any[] = [], breakdownData: any[] = [], pressureData: any[] = [], steamData: any[] = [];
    let breakdownLogs: any[] = [];

    if (showAnalytics) {
        // Parallel fetch for dashboard performance
        const results = await Promise.all([
            getFuelConsumptionStats(),
            getBreakdownStats(),
            getPressureTrends(),
            getSteamGenerationStats(),
            isManager ? getBreakdownLogs(10) : Promise.resolve([])
        ]);
        [fuelData, breakdownData, pressureData, steamData] = results;
        breakdownLogs = results[4] as any[];
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plant Dashboard</h1>
                    <p className="text-muted-foreground">
                        {isManager ? "Analytical overview and strategic suggestions." : "Operational metrics and action console."}
                    </p>
                </div>
            </div>

            {/* Operator Quick Actions */}
            {role === "operator" && (
                <OperatorView />
            )}

            {/* Shift Incharge / Engineer Quick Actions */}
            {isIncharge && (
                <div className="space-y-6">
                    <InchargeView />
                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-bold mb-4">Plant Performance Analytics</h2>
                    </div>
                </div>
            )}

            {/* Manager Specific Detailed Dashboard */}
            {isManager && (
                <ManagerDashboard
                    fuelData={fuelData}
                    breakdownData={breakdownData}
                    pressureData={pressureData}
                    steamData={steamData}
                    breakdownLogs={breakdownLogs}
                />
            )}

            {/* Standard Analytics for Staff (Operator/Incharge/Engineer) */}
            {!isManager && showAnalytics && (
                <div className="space-y-6">
                    {/* First Row: Fuel & Pressure */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fuel Consumption Trends</CardTitle>
                                <CardDescription>Daily usage (Last 30 days)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {fuelData.length > 0 ? (
                                        <FuelChart data={fuelData} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Steam Pressure Consistency</CardTitle>
                                <CardDescription>Pressure readings (Last 30 logs)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {pressureData.length > 0 ? (
                                        <PressureChart data={pressureData} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Second Row: Breakdowns & Steam Generation */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Breakdown Frequency</CardTitle>
                                <CardDescription>Incidents by Boiler</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {breakdownData.length > 0 ? (
                                        <BreakdownChart data={breakdownData} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">No breakdown records found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Steam Generation</CardTitle>
                                <CardDescription>Calculated Output (Tonnes)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {steamData.length > 0 ? (
                                        <SteamChart data={steamData} />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">No steam flow data found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
