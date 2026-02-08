"use client";

import { useTransition } from "react";
import { submitShiftLog } from "@/lib/log-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function ShiftLogForm() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await submitShiftLog(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Shift log submitted successfully!");
            }
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Daily Shift Log</CardTitle>
                <CardDescription>Enter operational data for your assigned boiler.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">

                    {/* Metadata Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="boilerId">Boiler ID</Label>
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
                        <div className="space-y-2">
                            <Label htmlFor="shift">Shift</Label>
                            <Select name="shift" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Shift A (Morning)</SelectItem>
                                    <SelectItem value="B">Shift B (Evening)</SelectItem>
                                    <SelectItem value="C">Shift C (Night)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input type="time" name="startTime" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input type="time" name="endTime" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="steamPressure">Steam Pressure (Psi/Bar)</Label>
                            <Input name="steamPressure" type="text" placeholder="e.g. 150 psi" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="steamTemp">Steam Temperature (°C) <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Input name="steamTemp" type="text" placeholder="e.g. 180" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                        <div className="space-y-2">
                            <Label htmlFor="steamFlowStart">Start Steam Flow Reading (Tonnes)</Label>
                            <Input name="steamFlowStart" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="steamFlowEnd">End Steam Flow Reading (Tonnes)</Label>
                            <Input name="steamFlowEnd" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                        <div className="col-span-2 text-xs text-muted-foreground">
                            This data is used to calculate steam generation tonnage per shift.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fuelType">Fuel Type</Label>
                            <Select name="fuelType" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Fuel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Coal">Coal</SelectItem>
                                    <SelectItem value="Gas">Natural Gas</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                    <SelectItem value="Biomass">Biomass</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fuelConsumed">Fuel Consumed (Kg/L)</Label>
                            <Input name="fuelConsumed" type="number" step="0.01" placeholder="0.00" required />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <Switch id="blowdownPerformed" name="blowdownPerformed" />
                        <div className="flex flex-col">
                            <Label htmlFor="blowdownPerformed">Blowdown Performed?</Label>
                            <span className="text-xs text-muted-foreground">Toggle if blowdown operation was carried out during this shift.</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks / Observations</Label>
                        <Textarea name="remarks" placeholder="Any abnormalities, maintenance notes, or general observations." />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting Log..." : "Submit Log Entry"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
