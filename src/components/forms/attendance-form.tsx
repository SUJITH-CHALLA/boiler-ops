"use client";

import { useTransition } from "react";
import { submitAttendance } from "@/lib/attendance-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export function AttendanceForm() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await submitAttendance(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Attendance marked successfully!");
            }
        });
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Select your shift and assigned boiler.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">

                    <div className="space-y-3">
                        <Label>Select Shift</Label>
                        <RadioGroup defaultValue="A" name="shift" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A" id="shift-a" />
                                <Label htmlFor="shift-a">Shift A</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B" id="shift-b" />
                                <Label htmlFor="shift-b">Shift B</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="C" id="shift-c" />
                                <Label htmlFor="shift-c">Shift C</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="boilerId">Assigned Boiler</Label>
                        <Select name="boilerId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Boiler" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="B1">Boiler #1</SelectItem>
                                <SelectItem value="B2">Boiler #2</SelectItem>
                                <SelectItem value="B3">Boiler #3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting..." : "Check In"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
