
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Download, FileText, Printer } from "lucide-react";
import { updateShiftLog } from "@/lib/log-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ShiftLogActions({ log, role }: { log: any, role: string }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const router = useRouter();

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
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted" title="View Details">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <span className="sr-only">View</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Shift Log Detail #{log.id}</DialogTitle>
                        <DialogDescription>Full record details.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Meta Info */}
                        <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Shift Info</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><Label className="text-muted-foreground">Date</Label><div className="font-medium">{log.date}</div></div>
                                <div><Label className="text-muted-foreground">Shift</Label><div className="font-medium">{log.shift}</div></div>
                                <div><Label className="text-muted-foreground">Boiler</Label><div className="font-medium">{log.boilerId}</div></div>
                                <div><Label className="text-muted-foreground">Logged By</Label><div className="font-medium">{log.operatorName}</div></div>
                                <div><Label className="text-muted-foreground">Created At</Label><div className="font-medium">{new Date(log.createdAt).toLocaleString()}</div></div>
                            </div>
                        </div>

                        {/* Core Parameters */}
                        <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Readings</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><Label className="text-muted-foreground">Start Time</Label><div className="font-medium">{log.startTime}</div></div>
                                <div><Label className="text-muted-foreground">End Time</Label><div className="font-medium">{log.endTime}</div></div>
                                <div><Label className="text-muted-foreground">Steam Pressure</Label><div className="font-medium">{log.steamPressure}</div></div>
                                <div><Label className="text-muted-foreground">Steam Temp</Label><div className="font-medium">{log.steamTemp || "-"}</div></div>
                                <div><Label className="text-muted-foreground">Flow Start</Label><div className="font-medium">{log.steamFlowStart}</div></div>
                                <div><Label className="text-muted-foreground">Flow End</Label><div className="font-medium">{log.steamFlowEnd}</div></div>
                            </div>
                        </div>

                        {/* Fuel Info */}
                        <div className="space-y-4 border p-4 rounded-lg bg-muted/20 md:col-span-2">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Fuel & Operations</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><Label className="text-muted-foreground">Fuel Type</Label><div className="font-medium">{log.fuelType}</div></div>
                                <div><Label className="text-muted-foreground">Consumed</Label><div className="font-medium">{log.fuelConsumed}</div></div>
                                <div><Label className="text-muted-foreground">Blowdown</Label><div className="font-medium">{log.blowdownPerformed ? "Yes" : "No"}</div></div>
                            </div>
                            <div className="mt-4">
                                <Label className="text-muted-foreground">Remarks</Label>
                                <div className="p-3 bg-white border rounded-md text-sm mt-1 whitespace-pre-wrap">{log.remarks || "No remarks."}</div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                            Export functionality coming soon.
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                <FileText className="mr-2 h-4 w-4" /> Export PDF
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
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
