
"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initialState = {
    message: "",
    success: false,
};

export function ChangePasswordForm() {
    // @ts-ignore
    const [state, formAction] = useActionState(updatePassword, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your login credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" name="currentPassword" type="password" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" name="newPassword" type="password" required minLength={6} />
                    </div>

                    <div className="flex items-center justify-between">
                        {state?.message && (
                            <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
                                {state.message}
                            </p>
                        )}
                        <Button type="submit">Update Password</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
