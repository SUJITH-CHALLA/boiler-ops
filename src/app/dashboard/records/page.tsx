
import { getShiftLogs, getAttendanceRecords, getBreakdownLogs } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShiftLogActions } from "@/components/records/shift-log-actions";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ExportButtons } from "@/components/records/export-buttons";
import { PrintButton } from "@/components/common/print-button";
import { X } from "lucide-react";

export default async function RecordsPage() {
    const session = await auth();
    const role = (session?.user as any)?.role as string;

    // Strict Access Control: Operators cannot view records
    if (role === "operator") {
        redirect("/dashboard");
    }

    // Parallel Data Fetching
    const [logs, attendanceData, breakdownData] = await Promise.all([
        getShiftLogs(),
        getAttendanceRecords(),
        getBreakdownLogs()
    ]);

    // Group Attendance by Date
    const groupedAttendance = attendanceData.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {} as Record<string, typeof attendanceData>);

    // Group Breakdowns by Date
    const groupedBreakdowns = breakdownData.reduce((acc, curr) => {
        const date = new Date(curr.createdAt).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {} as Record<string, typeof breakdownData>);

    return (
        <div className="space-y-6 print:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Records & History</h1>
                    <p className="text-muted-foreground">View and audit all historical logs and reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/5 text-primary">
                        Audit Mode: {role.replace("_", " ")}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="shift-logs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="shift-logs">Shift Summaries</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="breakdowns">Breakdowns</TabsTrigger>
                </TabsList>

                {/* Shift Logs Tab */}
                <TabsContent value="shift-logs">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Boiler Shift Summaries</CardTitle>
                                <CardDescription>Final shift reports submitted by Incharges.</CardDescription>
                            </div>
                            <ExportButtons data={logs} filename={`Shift-Reports-${new Date().toISOString().split('T')[0]}`} type="shift-logs" />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Boiler</TableHead>
                                        <TableHead>Incharge</TableHead>
                                        <TableHead>Pressure</TableHead>
                                        <TableHead>Fuel</TableHead>
                                        <TableHead className="text-right">View Report</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No records found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-medium">{log.date}</TableCell>
                                                <TableCell><Badge variant="outline">{log.shift}</Badge></TableCell>
                                                <TableCell>{log.boilerId}</TableCell>
                                                <TableCell>{log.operatorName}</TableCell>
                                                <TableCell>{log.steamPressure}</TableCell>
                                                <TableCell>{log.fuelConsumed}</TableCell>
                                                <TableCell className="text-right">
                                                    <ShiftLogActions
                                                        log={{
                                                            ...log,
                                                            createdAt: log.createdAt.toISOString()
                                                        }}
                                                        role={role}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Attendance History (Date-wise)</CardTitle>
                                <CardDescription>Summary of personnel present per day.</CardDescription>
                            </div>
                            <ExportButtons data={attendanceData} filename={`Attendance-Report-${new Date().toISOString().split('T')[0]}`} type="attendance" />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Staff Present</TableHead>
                                        <TableHead>Shifts Covered</TableHead>
                                        <TableHead className="text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.keys(groupedAttendance).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No records.</TableCell>
                                        </TableRow>
                                    ) : (
                                        Object.entries(groupedAttendance).map(([date, records]) => {
                                            const shiftCount = new Set(records.map(r => r.shift)).size;
                                            return (
                                                <TableRow key={date}>
                                                    <TableCell className="font-bold">{date}</TableCell>
                                                    <TableCell><Badge variant="secondary" className="text-sm px-3">{records.length} Members</Badge></TableCell>
                                                    <TableCell>{shiftCount} Shifts</TableCell>
                                                    <TableCell className="text-right">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    <Eye className="h-4 w-4" /> View Staff
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md">
                                                                <DialogHeader className="no-print relative">
                                                                    <div className="absolute right-0 top-0">
                                                                        <DialogClose asChild>
                                                                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted">
                                                                                <X className="h-4 w-4" />
                                                                                <span className="sr-only">Close</span>
                                                                            </Button>
                                                                        </DialogClose>
                                                                    </div>
                                                                    <DialogTitle>Attendance Details - {date}</DialogTitle>
                                                                    <DialogDescription>Shift-wise staff list for this day.</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-6 py-4 print-content">
                                                                    <div className="hidden print:block mb-4 border-b pb-2">
                                                                        <h1 className="text-xl font-bold italic uppercase tracking-widest text-primary">Daily Attendance Report</h1>
                                                                        <p className="text-sm">Date: <span className="font-bold underline">{date}</span></p>
                                                                    </div>
                                                                    {["A", "B", "C"].map(shift => {
                                                                        const shiftRecords = records.filter(r => r.shift === shift);
                                                                        if (shiftRecords.length === 0) return null;
                                                                        return (
                                                                            <div key={shift} className="space-y-2 break-inside-avoid border p-3 rounded-lg print:border-neutral-300">
                                                                                <div className="flex justify-between items-center border-b pb-1 mb-2">
                                                                                    <h3 className="font-bold text-sm">Shift {shift} Attendance</h3>
                                                                                    <div className="no-print">
                                                                                        <ExportButtons
                                                                                            data={shiftRecords}
                                                                                            filename={`Shift-${shift}-Attendance-${date}`}
                                                                                            type="attendance"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 gap-2">
                                                                                    {shiftRecords.map((r, i) => (
                                                                                        <div key={i} className="flex justify-between items-center text-sm border-b border-dashed pb-1 last:border-0">
                                                                                            <div className="font-medium">{r.userName}</div>
                                                                                            <div className="text-[10px] text-muted-foreground">{new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <DialogFooter className="no-print pt-4 border-t">
                                                                    <PrintButton label="Print Full Daily Report" />
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Breakdowns Tab */}
                <TabsContent value="breakdowns">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Breakdown History (Date-wise)</CardTitle>
                                <CardDescription>Consolidated incident reports per day.</CardDescription>
                            </div>
                            <ExportButtons data={breakdownData} filename={`Breakdown-Analytic-Report-${new Date().toISOString().split('T')[0]}`} type="breakdowns" />
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Incidents</TableHead>
                                        <TableHead>Impacted Units</TableHead>
                                        <TableHead className="text-right">View All</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.keys(groupedBreakdowns).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No records.</TableCell>
                                        </TableRow>
                                    ) : (
                                        Object.entries(groupedBreakdowns).map(([date, records]) => {
                                            const boilers = new Set(records.map(r => r.boilerId));
                                            const activeCount = records.filter(r => r.status !== 'resolved').length;
                                            const resolvedCount = records.length - activeCount;
                                            return (
                                                <TableRow key={date}>
                                                    <TableCell className="font-bold">{date}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            {activeCount > 0 && <Badge variant="destructive" className="px-2 h-5 text-[10px]">{activeCount} Active</Badge>}
                                                            {resolvedCount > 0 && <Badge variant="outline" className="px-2 h-5 text-[10px] border-green-500 text-green-700">{resolvedCount} Solved</Badge>}
                                                            {activeCount === 0 && resolvedCount === 0 && <Badge variant="secondary">0 Issues</Badge>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{Array.from(boilers).join(", ")}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="gap-2">
                                                                    <Eye className="h-4 w-4" /> View Details
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Breakdown Reports - {date}</DialogTitle>
                                                                    <DialogDescription>Detailed log of all incidents recorded on this day.</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-6 py-4">
                                                                    {records.map((r, i) => (
                                                                        <div key={i} className={cn(
                                                                            "border p-4 rounded-lg",
                                                                            r.status === 'resolved' ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"
                                                                        )}>
                                                                            <div className="flex justify-between mb-2">
                                                                                <div className="flex gap-2">
                                                                                    <Badge variant="outline" className={cn(
                                                                                        "font-bold",
                                                                                        r.status === 'resolved' ? "border-green-500 text-green-700" : "border-red-500 text-red-700"
                                                                                    )}>Boiler: {r.boilerId}</Badge>
                                                                                    <Badge variant={r.status === 'resolved' ? "outline" : "destructive"} className="text-[10px] h-5">
                                                                                        {r.status || 'active'}
                                                                                    </Badge>
                                                                                </div>
                                                                                <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleTimeString()}</span>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <div><Label className="text-[10px] uppercase text-muted-foreground">Issue Description</Label><p className="text-sm font-medium">{r.issueDescription}</p></div>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div><Label className="text-[10px] uppercase text-muted-foreground">Action Taken</Label><p className="text-sm">{r.actionTaken || "Pending..."}</p></div>
                                                                                    <div><Label className="text-[10px] uppercase text-muted-foreground">Downtime</Label><p className="font-bold text-sm">{(r.downtimeMinutes ?? 0) > 0 ? `${r.downtimeMinutes} mins` : "In Progress"}</p></div>
                                                                                </div>
                                                                                <div className="text-[10px] text-right text-muted-foreground italic">Reported By: {r.reportedBy}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="mt-6 flex justify-between items-center border-t pt-4 no-print">
                                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">End of Reports</p>
                                                                    <div className="flex gap-2">
                                                                        <PrintButton label="Print All" />
                                                                        <Button variant="outline" size="sm" asChild>
                                                                            <Link href="/dashboard/breakdown">Report/Resolve New Issues</Link>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
