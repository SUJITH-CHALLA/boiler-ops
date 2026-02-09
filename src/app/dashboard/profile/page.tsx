
import { auth, signOut } from "@/auth";
import { ChangePasswordForm } from "./password-form";
import { Button } from "@/components/ui/button";

import { getAppVersion, LAST_UPDATED } from "@/lib/version";

export default async function ProfilePage() {
    const session = await auth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <ChangePasswordForm />

                {/* User Info Card */}
                <div className="rounded-lg border bg-card p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Account Information</h3>
                        <div className="mt-4 space-y-2 text-sm">
                            <p><strong>Name:</strong> {session?.user?.name}</p>
                            <p><strong>Email:</strong> {session?.user?.email}</p>
                            {/* @ts-ignore */}
                            <p><strong>Role:</strong> <span className="capitalize">{session?.user?.role}</span></p>
                        </div>
                    </div>

                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                        className="mt-6 pt-6 border-t"
                    >
                        <Button variant="destructive" className="w-full">
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground w-full">
                <p className="font-mono text-xs">App Version: {getAppVersion()}</p>
                <p className="text-[10px]">Updated: {LAST_UPDATED}</p>
            </div>
        </div>
    );
}
