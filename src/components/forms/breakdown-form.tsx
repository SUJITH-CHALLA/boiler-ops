
"use client";

import { useTransition } from "react";
import { submitBreakdown, resolveBreakdown } from "@/lib/breakdown-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

interface Breakdown {
    id: number;
    boilerId: string;
    issueDescription: string;
    startTime: Date;
    status: "active" | "resolved";
}

export function BreakdownForm({ activeBreakdowns = [] }: { activeBreakdowns?: Breakdown[] }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await submitBreakdown(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Breakdown reported! Status is Active.");
            }
        });
    };

    const handleResolve = (id: number, formData: FormData) => {
        startTransition(async () => {
            const result = await resolveBreakdown(id, formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Breakdown marked as Resolved!");
            }
        });
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* New Breakdown Report */}
            <Card className="border-destructive/50 h-fit">
                <CardHeader>
                    <CardTitle className="text-destructive">Report New Breakdown</CardTitle>
                    <CardDescription>Log issue to notify management. Status will be 'Active'.</CardDescription>
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
                                placeholder="Describe the problem..."
                                required
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
                            {isPending ? "Reporting..." : "Report Active Breakdown"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Active Breakdowns List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Active Breakdowns ({activeBreakdowns.length})</h3>
                {activeBreakdowns.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No active breakdowns. All systems operational.
                        </CardContent>
                    </Card>
                ) : (
                    activeBreakdowns.map((bd) => (
                        <Card key={bd.id} className="border-l-4 border-l-destructive">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle>Boiler {bd.boilerId}</CardTitle>
                                    <Badge variant="destructive">Active</Badge>
                                </div>
                                <CardDescription>Started: {new Date(bd.startTime).toLocaleString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-sm font-medium">Issue:</p>
                                <p className="text-sm text-muted-foreground mb-4">{bd.issueDescription}</p>

                                <div className="border-b my-2" />

                                <form action={(fd) => handleResolve(bd.id, fd)} className="space-y-3 mt-2">
                                    <Label className="text-xs font-bold text-primary">Mark as Resolved</Label>
                                    <div className="space-y-1">
                                        <Label htmlFor="endTime" className="text-xs">Resolution Time</Label>
                                        <Input type="datetime-local" name="endTime" required className="h-8 text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="actionTaken" className="text-xs">Action Taken</Label>
                                        <Textarea name="actionTaken" placeholder="Fix details..." required className="h-20 text-xs" />
                                    </div>
                                    <Button type="submit" size="sm" variant="outline" className="w-full" disabled={isPending}>
                                        Resolve Issue
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
