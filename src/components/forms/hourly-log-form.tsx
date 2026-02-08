
"use client";

import { submitHourlyLog } from "@/lib/log-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function HourlyLogForm({ fields }: { fields: any[] }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const res = await submitHourlyLog(formData);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Hourly Log Recorded!");
                router.push("/dashboard"); // Redirect home
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Hourly Log Entry</CardTitle>
                <CardDescription>Record readings for the current hour.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Select Boiler</Label>
                            <Select name="boilerId" defaultValue="Main Boiler">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Main Boiler">Main Boiler</SelectItem>
                                    <SelectItem value="Aux Boiler">Aux Boiler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Shift</Label>
                            <Select name="shift" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Shift A</SelectItem>
                                    <SelectItem value="B">Shift B</SelectItem>
                                    <SelectItem value="C">Shift C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label>Reading Time</Label>
                            <Input
                                type="time"
                                name="readingTime"
                                required
                                defaultValue={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Parameters</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {fields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label>
                                        {field.label}
                                        {field.unit && <span className="text-muted-foreground ml-1 text-xs">({field.unit})</span>}
                                        {field.required && <span className="text-destructive ml-1">*</span>}
                                    </Label>
                                    {field.type === "select" ? (
                                        <Select name={field.key} required={field.required}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Normal">Normal</SelectItem>
                                                <SelectItem value="Warning">Warning</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            name={field.key}
                                            type={field.type === "number" ? "number" : "text"}
                                            step={field.type === "number" ? "0.01" : undefined}
                                            required={field.required}
                                            placeholder={`Enter ${field.label}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Reading"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
