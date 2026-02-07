import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <form
                    action={async () => {
                        "use server";
                        await signOut();
                    }}
                >
                    <button className="text-sm font-medium hover:underline">
                        Sign Out
                    </button>
                </form>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Welcome back, {session?.user?.name || "Operator"}</h2>
                <p className="text-muted-foreground mt-2">
                    Select an action from the navigation menu to get started.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Placeholder Stats */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Shift Status</div>
                    <div className="text-2xl font-bold">Active</div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Last Check-in</div>
                    <div className="text-2xl font-bold">Today, 08:00 AM</div>
                </div>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Pending Reports</div>
                    <div className="text-2xl font-bold">0</div>
                </div>
            </div>
        </div>
    );
}
