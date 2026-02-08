
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { PenTool, AlertTriangle, Users } from "lucide-react";

export function InchargeView() {
    return (
        <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-1">Shift Incharge Controller</h3>
                <p className="text-sm text-muted-foreground">Manage shift reports and personnel attendance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/shift-log" className="block h-full">
                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer h-full border-l-4 border-l-primary shadow-sm group">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="group-hover:text-primary transition-colors">Final Shift Summary</CardTitle>
                                <PenTool className="h-6 w-6 text-primary" />
                            </div>
                            <CardDescription>Consolidate hourly data and finalize the end-of-shift report.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/attendance" className="block h-full">
                    <Card className="hover:bg-indigo-50 transition-colors cursor-pointer h-full border-l-4 border-l-indigo-600 shadow-sm group">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="group-hover:text-indigo-600 transition-colors">Manage Attendance</CardTitle>
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                            <CardDescription>Verify and mark present staff for the current shift.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/breakdown" className="block h-full">
                    <Card className="hover:bg-red-50 transition-colors cursor-pointer h-full border-l-4 border-l-destructive shadow-sm group">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-destructive">Breakdown Management</CardTitle>
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardDescription>Directly record and track equipment downtime.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
