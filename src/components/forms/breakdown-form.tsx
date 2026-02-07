"use client";

import { useTransition } from "react";
import { submitBreakdown } from "@/lib/breakdown-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function BreakdownForm() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await submitBreakdown(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Breakdown reported successfully!");
            }
        });
    };

    return (
        <Card className="max-w-xl mx-auto border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Report Breakdown</CardTitle>
                <CardDescription>Log a boiler breakdown or malfunction for maintenance tracking.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="boilerId">Affected Boiler</Label>
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
                        <Label htmlFor="issueDescription">Issue Description</Label>
                        <Textarea
                            name="issueDescription"
                            placeholder="Describe the problem, symptoms, and what happened."
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="downtimeMinutes">Estimated Downtime (Minutes)</Label>
                        <Input
                            name="downtimeMinutes"
                            type="number"
                            placeholder="e.g. 45"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="actionTaken">Action Taken</Label>
                        <Textarea
                            name="actionTaken"
                            placeholder="What immediate actions were taken to resolve or mitigate the issue?"
                            required
                        />
                    </div>

                    <Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting Report..." : "Submit Breakdown Report"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
