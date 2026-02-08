
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Download, FileText, Printer } from "lucide-react";
import { updateShiftLog } from "@/lib/log-actions";
import { fetchHourlyLogs } from "@/lib/fetch-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function ShiftLogActions({ log, role }: { log: any, role: string }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [hourlyReports, setHourlyReports] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    const router = useRouter();

    const handleViewOpen = async (open: boolean) => {
        setIsViewOpen(open);
        if (open) {
            setIsLoadingLogs(true);
            try {
                const logs = await fetchHourlyLogs(log.id);
                setHourlyReports(logs);
            } catch (err) {
                toast.error("Failed to load hourly reports");
            } finally {
                setIsLoadingLogs(false);
            }
        }
    };

    const handleUpdate = async (formData: FormData) => {
        const res = await updateShiftLog(log.id, formData);
        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success("Log Updated Successfully");
            setIsEditOpen(false);
            router.refresh(); // Refresh server data
        }
    };

    const canEdit = role === "manager" || role === "engineer" || role === "shift_incharge";

    return (
        <div className="flex items-center gap-1 justify-end">
            {/* View Button */}
            <Dialog open={isViewOpen} onOpenChange={handleViewOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="View Details">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="sr-only">View</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto pt-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <span className="print:text-3xl">Boiler Shift Log Report</span>
                        </DialogTitle>
                        <DialogDescription className="print:text-black print:font-bold">
                            Shift ID: {log.id} | Date: {log.date} | Shift: {log.shift} | Boiler: {log.boilerId}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="summary" className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="summary">Shift Summary</TabsTrigger>
                            <TabsTrigger value="hourly">Hourly Log</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-6 pt-4 print:block">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4 print:grid-cols-2">
                                {/* Meta Info */}
                                <div className="space-y-4 border p-4 rounded-lg bg-muted/20 print:bg-transparent print:border-neutral-300 break-inside-avoid">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-primary border-b pb-2 print:text-black">Personnel & Pressure</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Boiler ID</Label><div className="font-bold text-base">{log.boilerId}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Incharge</Label><div className="font-medium">{log.operatorName}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Avg Pressure</Label><div className="font-bold text-base text-primary print:text-black">{log.steamPressure}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Temperature</Label><div className="font-medium">{log.steamTemp || "-"}</div></div>
                                    </div>
                                </div>

                                {/* Flow & Fuel Info */}
                                <div className="space-y-4 border p-4 rounded-lg bg-muted/20 print:bg-transparent print:border-neutral-300 break-inside-avoid">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-primary border-b pb-2 print:text-black">Resources Consumption</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Fuel</Label><div className="font-medium text-base">{log.fuelType}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Consumed</Label><div className="font-bold text-base">{log.fuelConsumed}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Initial Flow</Label><div className="font-medium">{log.steamFlowStart}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Final Flow</Label><div className="font-medium">{log.steamFlowEnd}</div></div>
                                    </div>
                                </div>

                                <div className="space-y-4 border p-4 rounded-lg bg-muted/20 md:col-span-2 print:bg-transparent print:border-neutral-300 break-inside-avoid">
                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-primary border-b pb-2 print:text-black">Shift Timeline & Notes</h3>
                                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Blowdown Status</Label><div><Badge variant={log.blowdownPerformed ? "default" : "secondary"} className="print:border-black">{log.blowdownPerformed ? "Completed" : "Not Done"}</Badge></div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Commenced</Label><div className="font-medium">{log.startTime}</div></div>
                                        <div><Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Concluded</Label><div className="font-medium">{log.endTime}</div></div>
                                    </div>
                                    <div className="mt-4 border-t pt-4">
                                        <Label className="text-muted-foreground text-[10px] uppercase print:text-neutral-500">Handover Remarks</Label>
                                        <div className="p-3 bg-white border rounded-md text-sm mt-1 whitespace-pre-wrap italic print:border-neutral-200">{log.remarks || "No remarks provided."}</div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="hourly" className="pt-4 print:block">
                            <h3 className="hidden print:block font-bold mb-4 text-lg border-b pb-2">Hourly Operator Readings Log</h3>
                            {isLoadingLogs ? (
                                <div className="flex justify-center p-12 text-muted-foreground animate-pulse font-medium">Loading operator readings...</div>
                            ) : hourlyReports.length === 0 ? (
                                <div className="text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground border-dashed">No hourly readings recorded for this shift.</div>
                            ) : (
                                <div className="border rounded-md overflow-hidden bg-white shadow-sm print:border-neutral-300">
                                    <Table>
                                        <TableHeader className="bg-muted/50 print:bg-neutral-100">
                                            <TableRow>
                                                <TableHead className="w-[100px] print:text-black">Reading Time</TableHead>
                                                <TableHead className="w-[150px] print:text-black">Operator</TableHead>
                                                <TableHead className="print:text-black">Readings Metadata</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {hourlyReports.map((hLog: any) => (
                                                <TableRow key={hLog.id} className="hover:bg-muted/30 break-inside-avoid">
                                                    <TableCell className="font-bold text-primary print:text-black">
                                                        {hLog.readingTime || new Date(hLog.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium">{hLog.recordedBy}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px]">
                                                            {Object.entries(hLog.readings).map(([k, v]: [string, any]) => (
                                                                <div key={k} className="flex gap-2 items-center bg-muted px-2 py-0.5 rounded border print:bg-neutral-50 print:border-neutral-200">
                                                                    <span className="text-muted-foreground capitalize font-medium print:text-neutral-500">{k.replace(/_/g, ' ')}:</span>
                                                                    <span className="font-bold text-foreground print:text-black">{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between border-t mt-4 pt-4 no-print">
                        <p className="text-[10px] text-muted-foreground hidden sm:block">System Timestamp: {new Date().toLocaleString()}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Printer className="mr-2 h-4 w-4" /> Print Report (Summary + Hourly)
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setIsViewOpen(false)}>Close</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Button - Restricted */}
            {canEdit && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="Edit Log">
                            <Edit className="h-4 w-4 text-orange-500" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Log #{log.id}</DialogTitle>
                            <DialogDescription>Modify record details. Audit trace will be updated.</DialogDescription>
                        </DialogHeader>
                        <form action={handleUpdate} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Boiler ID</Label>
                                    <Input name="boilerId" defaultValue={log.boilerId} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Shift</Label>
                                    <Select name="shift" defaultValue={log.shift}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Shift A</SelectItem>
                                            <SelectItem value="B">Shift B</SelectItem>
                                            <SelectItem value="C">Shift C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2"><Label>Start Time</Label><Input name="startTime" defaultValue={log.startTime} required /></div>
                                <div className="space-y-2"><Label>End Time</Label><Input name="endTime" defaultValue={log.endTime} required /></div>

                                <div className="space-y-2"><Label>Steam Pressure</Label><Input name="steamPressure" defaultValue={log.steamPressure} required /></div>
                                <div className="space-y-2"><Label>Steam Temp</Label><Input name="steamTemp" defaultValue={log.steamTemp || ""} /></div>

                                <div className="space-y-2"><Label>Flow Start</Label><Input name="steamFlowStart" defaultValue={log.steamFlowStart} /></div>
                                <div className="space-y-2"><Label>Flow End</Label><Input name="steamFlowEnd" defaultValue={log.steamFlowEnd} /></div>

                                <div className="space-y-2"><Label>Fuel Type</Label><Input name="fuelType" defaultValue={log.fuelType} required /></div>
                                <div className="space-y-2"><Label>Fuel Consumed</Label><Input name="fuelConsumed" defaultValue={log.fuelConsumed} required /></div>
                            </div>
                            <div className="space-y-2">
                                <Label>Remarks</Label>
                                <Input name="remarks" defaultValue={log.remarks || ""} />
                            </div>

                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
