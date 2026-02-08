
import { getShiftLogs, getAttendanceRecords, getBreakdownLogs } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShiftLogActions } from "@/components/records/shift-log-actions";

export default async function RecordsPage() {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Records & History</h1>
                <p className="text-muted-foreground">View and audit all historical logs and reports.</p>
            </div>

            <Tabs defaultValue="shift-logs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="shift-logs">Shift Logs</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="breakdowns">Breakdowns</TabsTrigger>
                </TabsList>

                {/* Shift Logs Tab */}
                <TabsContent value="shift-logs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Boiler Shift Logs</CardTitle>
                            <CardDescription>Daily operational readings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Boiler</TableHead>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>Pressure</TableHead>
                                        <TableHead>Fuel</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                                No logs found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{log.shift}</Badge>
                                                </TableCell>
                                                <TableCell>{log.boilerId}</TableCell>
                                                <TableCell>{log.operatorName}</TableCell>
                                                <TableCell>{log.steamPressure}</TableCell>
                                                <TableCell>{log.fuelConsumed} ({log.fuelType})</TableCell>
                                                <TableCell className="max-w-[150px] truncate">{log.remarks || "-"}</TableCell>
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
                        <CardHeader>
                            <CardTitle>Attendance Register</CardTitle>
                            <CardDescription>Operator check-ins.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Boiler</TableHead>
                                        <TableHead>Check-In Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No attendance records found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceData.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.date}</TableCell>
                                                <TableCell className="font-medium">{record.userName || "Unknown"}</TableCell>
                                                <TableCell><Badge variant="outline">{record.shift}</Badge></TableCell>
                                                <TableCell>{record.boilerId}</TableCell>
                                                <TableCell>{record.checkInTime.toLocaleTimeString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Breakdowns Tab */}
                <TabsContent value="breakdowns">
                    <Card>
                        <CardHeader>
                            <CardTitle>Breakdown Reports</CardTitle>
                            <CardDescription>Critical maintenance logs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Reported By</TableHead>
                                        <TableHead>Boiler</TableHead>
                                        <TableHead>Issue</TableHead>
                                        <TableHead>Downtime</TableHead>
                                        <TableHead>Action Taken</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {breakdownData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                No breakdown reports found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        breakdownData.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.createdAt.toLocaleDateString()}</TableCell>
                                                <TableCell>{record.reportedBy || "Unknown"}</TableCell>
                                                <TableCell className="font-bold text-destructive">{record.boilerId}</TableCell>
                                                <TableCell>{record.issueDescription}</TableCell>
                                                <TableCell>{record.downtimeMinutes} mins</TableCell>
                                                <TableCell>{record.actionTaken}</TableCell>
                                            </TableRow>
                                        ))
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
