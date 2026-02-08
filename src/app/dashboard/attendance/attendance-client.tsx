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

// Define Props Interface
type User = {
    id: number;
    name: string;
    role: string;
};

type Props = {
    users: User[];
    presentIds: number[]; // Change from Record to Array of IDs for simplicity
    role: string;
};

export function AttendanceSheet({ users, presentIds, role }: Props) {
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
                <CardHeader>
                    <CardTitle>Daily Shift Attendance</CardTitle>
                    <CardDescription>Select employees present for the selected date & shift.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input
                                type="date"
                                value={dateParam}
                                onChange={(e) => handleDateChange(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2 w-[120px]">
                            <label className="text-sm font-medium">Shift</label>
                            <Select value={shiftParam} onValueChange={handleShiftChange} disabled={isPending}>
                                <SelectTrigger>
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
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Search</label>
                            <Input
                                placeholder="Type name or role..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
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
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isChecked = selectedIds.has(user.id);
                                        return (
                                            <TableRow key={user.id} className={isChecked ? "bg-muted/30" : ""}>
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
