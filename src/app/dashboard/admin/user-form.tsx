
"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initialState = {
    message: "",
    errors: {},
};

export function AddUserForm() {
    const [state, formAction] = useActionState(createUser, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Enter the staff name and role. Login ID and default password will be generated automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" required defaultValue="operator">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="operator">Operator</SelectItem>
                                    <SelectItem value="shift_incharge">Shift In-Charge</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="engineer">Engineer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {state?.message && (
                            <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
                                {state.message}
                            </p>
                        )}
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
