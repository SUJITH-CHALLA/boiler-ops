
"use client";

import { useState } from "react";
import { useTransition } from "react";
import { addFormField, deleteFormField, toggleFormField } from "@/lib/form-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";

export function FormFieldManager({ fields }: { fields: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleAdd = (formData: FormData) => {
        startTransition(async () => {
            const res = await addFormField(formData);
            if (res?.error) toast.error(res.error);
            else toast.success("Field added successfully");
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm("Are you sure? This will remove the column from future logs.")) return;
        startTransition(async () => {
            const res = await deleteFormField(id);
            if (res?.error) toast.error(res.error);
            else toast.success("Field removed");
        });
    };

    const handleToggle = (id: number, current: boolean) => {
        startTransition(async () => {
            await toggleFormField(id, !current);
        });
    };

    return (
        <div className="space-y-8">
            {/* Add New Field */}
            <Card>
                <CardHeader>
                    <CardTitle>Add New Column</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-5 space-y-2">
                            <Label>Label</Label>
                            <Input name="label" placeholder="e.g. Feed Pump Amps" className="h-10" required />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label>Type</Label>
                            <Select name="type" defaultValue="number">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="select">Select (OK/Issue)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Unit</Label>
                            <Input name="unit" placeholder="e.g. A" className="h-10" />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={isPending} className="w-full h-10">
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* List Existing Fields */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Form Columns</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Key</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field) => (
                                <TableRow key={field.id} className={!field.isActive ? "opacity-50" : ""}>
                                    <TableCell className="font-medium">{field.label}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{field.key}</TableCell>
                                    <TableCell className="capitalize">{field.type}</TableCell>
                                    <TableCell>{field.unit || "-"}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={field.isActive}
                                            onCheckedChange={() => handleToggle(field.id, field.isActive)}
                                            disabled={isPending}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-red-600"
                                            onClick={() => handleDelete(field.id)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {fields.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        No custom fields defined.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
