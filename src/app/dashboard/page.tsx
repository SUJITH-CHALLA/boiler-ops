import { auth, signOut } from "@/auth";
import { getFuelConsumptionStats, getBreakdownStats, getPressureTrends } from "@/lib/analytics-data";
import { FuelChart, BreakdownChart, PressureChart } from "@/components/analytics/Charts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { OperatorView } from "@/components/dashboard/operator-view";

export default async function DashboardPage() {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;
    const showAnalytics = role === "manager" || role === "engineer" || role === "shift_incharge";

    let fuelData = [], breakdownData = [], pressureData = [];

    if (showAnalytics) {
        // Parallel fetch for dashboard performance
        [fuelData, breakdownData, pressureData] = await Promise.all([
            getFuelConsumptionStats(),
            getBreakdownStats(),
            getPressureTrends()
        ]);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <form
                    action={async () => {
                        "use server";
                        await signOut();
                    }}
                >
                    <button className="text-sm font-medium hover:underline text-destructive">
                        Sign Out
                    </button>
                </form>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Welcome back, {session?.user?.name || "Operator"}</h2>
                        <p className="text-muted-foreground mt-1">
                            {showAnalytics ? "System overview and performance metrics." : "Select an action to proceed."}
                        </p>
                    </div>
                    {showAnalytics && (
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20 capitalize">
                            {role} View
                        </div>
                    )}
                </div>
            </div>

            {/* Operator Quick Stats / Action Console */}
            {!showAnalytics && (
                <OperatorView />
            )}

            {/* Manager / Engineer Analytics Section */}
            {showAnalytics && (
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

                    {/* Second Row: Breakdowns */}
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

                        {/* Placeholder for Efficiency or Alerts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Health</CardTitle>
                                <CardDescription>Current Alerts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-md border p-4">
                                        <span className="text-sm font-medium">Critical Issues</span>
                                        <span className="text-2xl font-bold text-green-600">0</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-md border p-4">
                                        <span className="text-sm font-medium">Maintenance Due</span>
                                        <span className="text-2xl font-bold text-orange-500">2 Days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
