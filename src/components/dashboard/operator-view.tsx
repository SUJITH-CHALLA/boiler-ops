
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { PenTool, AlertTriangle, ClipboardList } from "lucide-react";

export function OperatorView() {
    return (
        <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-semibold mb-1">Operator Console</h3>
                <p className="text-sm text-muted-foreground">Select an action to proceed. No historical records are displayed here.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/shift-log/hourly" className="block h-full">
                    <Card className="hover:bg-primary/5 transition-colors cursor-pointer h-full border-l-4 border-l-orange-500">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-orange-600">Hourly Logs</CardTitle>
                                <ClipboardList className="h-6 w-6 text-orange-600" />
                            </div>
                            <CardDescription>Update boiler parameters every hour.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/breakdown" className="block h-full">
                    <Card className="hover:bg-red-50 transition-colors cursor-pointer h-full border-l-4 border-l-destructive">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-destructive">Report Breakdown</CardTitle>
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardDescription>Log critical equipment failures or safety issues.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
