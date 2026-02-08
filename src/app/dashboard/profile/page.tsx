
import { auth } from "@/auth";
import { ChangePasswordForm } from "./password-form";

export default async function ProfilePage() {
    const session = await auth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <ChangePasswordForm />

                {/* User Info Card */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Name:</strong> {session?.user?.name}</p>
                        <p><strong>Email:</strong> {session?.user?.email}</p>
                        {/* @ts-ignore */}
                        <p><strong>Role:</strong> <span className="capitalize">{session?.user?.role}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
