import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, UserCircle, LayoutDashboard, ClipboardList, PenTool, AlertTriangle, History, Shield, LogOut } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { auth, signOut } from "@/auth";
import { NavLinks } from "./nav-links";

export async function Navbar() {
    const session = await auth();
    // @ts-ignore
    const role = session?.user?.role;
    const isLoggedIn = !!session?.user;

    // Authorization checks
    const canViewRecords = role === "manager" || role === "engineer" || role === "shift_incharge";
    const canDoFullLog = role === "shift_incharge" || role === "engineer" || role === "manager";
    const isAdmin = role === "engineer";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-primary px-4 py-3 text-primary-foreground shadow-sm">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Mobile Menu - Only if logged in */}
                    {isLoggedIn && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary/20 hover:text-white">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-background">
                                <SheetHeader>
                                    <SheetTitle className="text-left text-xl font-bold text-primary">BoilerOps</SheetTitle>
                                </SheetHeader>
                                <nav className="mt-8 flex flex-col gap-4">
                                    <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                        <LayoutDashboard className="h-5 w-5" />
                                        Dashboard
                                    </Link>

                                    {/* Attendance: Only for Shift Incharge+ and NOT Manager */}
                                    {canViewRecords && role !== "manager" && (
                                        <Link href="/dashboard/attendance" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                            <ClipboardList className="h-5 w-5" />
                                            Attendance
                                        </Link>
                                    )}

                                    {role === "operator" && (
                                        <Link href="/dashboard/shift-log/hourly" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                            <ClipboardList className="h-5 w-5" />
                                            Hourly Logs
                                        </Link>
                                    )}

                                    {role === "manager" ? (
                                        <Link href="/dashboard/records" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                            <PenTool className="h-5 w-5" />
                                            Shift Summary
                                        </Link>
                                    ) : (
                                        canDoFullLog && (
                                            <Link href="/dashboard/shift-log" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                                <PenTool className="h-5 w-5" />
                                                Shift Log
                                            </Link>
                                        )
                                    )}

                                    {role !== "manager" && (
                                        <Link href="/dashboard/breakdown" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-destructive">
                                            <AlertTriangle className="h-5 w-5" />
                                            Report Breakdown
                                        </Link>
                                    )}

                                    {canViewRecords && role !== "manager" && (
                                        <Link href="/dashboard/records" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                            <History className="h-5 w-5" />
                                            Records History
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link href="/dashboard/admin" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-primary">
                                            <Shield className="h-5 w-5" />
                                            Admin Console
                                        </Link>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    )}

                    <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight">
                        BoilerOps
                    </Link>
                </div>

                {/* Desktop Navigation - Only if logged in */}
                {isLoggedIn && (
                    <NavLinks role={role || "operator"} canViewRecords={canViewRecords} isAdmin={isAdmin} />
                )}

                {/* User / Actions */}
                <div className="flex items-center gap-4">
                    {isLoggedIn && (
                        <div className="hidden md:flex flex-col items-end text-right">
                            <span className="text-sm font-semibold">{session.user?.name}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold">{role}</span>
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className="flex items-center">
                            <Link href="/dashboard/profile" title="Profile Settings">
                                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20 hover:text-white rounded-full">
                                    <UserCircle className="h-7 w-7" />
                                    <span className="sr-only">User profile</span>
                                </Button>
                            </Link>
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}
                            >
                                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-destructive hover:text-white rounded-full ml-1" title="Sign Out">
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Sign out</span>
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
