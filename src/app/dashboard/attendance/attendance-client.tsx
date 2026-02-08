"use client";

import { useTransition, useState, useEffect } from "react";
import { saveBulkAttendance } from "@/lib/attendance-actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExportButtons } from "@/components/records/export-buttons";
import { Printer } from "lucide-react";

type User = {
    id: number;
    name: string;
    role: string;
};

// Define Props Interface
type Props = {
    users: User[];
    presentIds: number[];
    role: string;
    date: string;
    shift: string;
    isManager: boolean;
    allRecords: any[];
};

export function AttendanceSheet({ users, presentIds, role, date, shift, isManager, allRecords }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const shiftParam = (searchParams.get("shift") as "A" | "B" | "C") || "A";

    const [isPending, startTransition] = useTransition();
    // Local state for checkboxes to allow immediate UI feedback
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(presentIds));
    const [search, setSearch] = useState("");

    // Sync local state when server data changes (e.g. navigation)
    useEffect(() => {
        setSelectedIds(new Set(presentIds));
    }, [presentIds]);

    const isReadOnly = role === "operator";

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleDateChange = (newDate: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("date", newDate);
        router.push(`?${params.toString()}`);
    };

    const handleShiftChange = (newShift: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("shift", newShift);
        router.push(`?${params.toString()}`);
    };

    const handleToggle = (userId: number, checked: boolean) => {
        if (isReadOnly) return;
        const newSet = new Set(selectedIds);
        if (checked) newSet.add(userId);
        else newSet.delete(userId);
        setSelectedIds(newSet);
    };

    const handleSave = () => {
        if (isReadOnly) return;

        startTransition(async () => {
            const ids = Array.from(selectedIds);
            // alert(`Saving for ${dateParam} Shift ${shiftParam}: ${ids.join(", ")}`);
            const res = await saveBulkAttendance(dateParam, shiftParam, "Main Boiler", ids);
            if (res.success) {
                alert("Attendance Updated Successfully");
            } else {
                alert("Failed: " + res.message);
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-2xl font-bold">Shift Attendance: {date}</CardTitle>
                        <CardDescription>
                            {isManager ? "Viewing recorded attendance for audit." : "Mark employees present for current shift."}
                        </CardDescription>
                    </div>
                    {isManager && (
                        <div className="flex gap-2 no-print">
                            <Button variant="outline" size="sm" onClick={() => window.print()}>
                                <Printer className="mr-2 h-4 w-4" /> Print PDF
                            </Button>
                            <ExportButtons
                                data={allRecords}
                                filename={`Attendance-${shift}-${date}`}
                                type="attendance"
                            />
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-end no-print">
                        {/* Date Filter */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-sm font-medium">Select Date</label>
                            <Input
                                type="date"
                                className="h-10 w-full"
                                value={date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                disabled={isPending}
                            />
                        </div>

                        {/* Shift Filter */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-sm font-medium">Select Shift</label>
                            <Select value={shift} onValueChange={handleShiftChange} disabled={isPending}>
                                <SelectTrigger className="h-10 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Shift A (Morning)</SelectItem>
                                    <SelectItem value="B">Shift B (Evening)</SelectItem>
                                    <SelectItem value="C">Shift C (Night)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Bar */}
                        <div className="md:col-span-6 space-y-2">
                            <label className="text-sm font-medium">Search Personnel</label>
                            <Input
                                placeholder="Filter by name or role..."
                                className="h-10 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="hidden print:block mb-6 border-b-2 pb-2">
                        <div className="flex justify-between items-center mr-1">
                            <div>
                                <h1 className="text-2xl font-bold text-primary">Shift Attendance Report</h1>
                                <p className="text-sm text-neutral-600 italic">Official Plant Record</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Date: {date}</p>
                                <p className="font-bold">Shift: {shift}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">
                                        Status
                                    </TableHead>
                                    <TableHead>Employee Name</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isManager ? (
                                    filteredUsers.filter(u => selectedIds.has(u.id)).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                No attendance records found for this shift.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.filter(u => selectedIds.has(u.id)).map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">PRESENT</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isChecked = selectedIds.has(user.id);
                                        return (
                                            <TableRow key={user.id} className={isChecked ? "bg-muted/30" : "print:hidden"}>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(c) => handleToggle(user.id, c as boolean)}
                                                        disabled={isReadOnly || isPending}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isReadOnly && (
                        <div className="mt-6 flex justify-end gap-3">
                            <div className="text-sm text-muted-foreground self-center">
                                {selectedIds.size} employees marked present.
                            </div>
                            <Button onClick={handleSave} disabled={isPending} className="w-full md:w-auto">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Saving..." : "Update Attendance Sheet"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
