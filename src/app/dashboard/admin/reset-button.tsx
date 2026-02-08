
"use client";

import { adminResetPassword } from "@/lib/user-actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { RefreshCcw } from "lucide-react";

export function ResetPasswordButton({ userId }: { userId: number }) {
    const [isPending, startTransition] = useTransition();

    function onReset() {
        if (!confirm("Are you sure you want to reset this user's password to 'password123'?")) return;

        startTransition(async () => {
            const result = await adminResetPassword(userId);
            if (result.success) alert(result.message);
            else alert(result.message);
        });
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={isPending}
            title="Reset Password to default"
        >
            <RefreshCcw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
        </Button>
    );
}
