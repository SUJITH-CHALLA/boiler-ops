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
import { auth } from "@/auth";
import { logout } from "@/actions/auth-actions";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { getAppVersion, LAST_UPDATED } from "@/lib/version";

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
                            <SheetContent side="left" className="bg-background flex flex-col">
                                <SheetHeader>
                                    <SheetTitle className="text-left text-xl font-bold text-primary">BoilerOps</SheetTitle>
                                </SheetHeader>
                                <MobileNav
                                    role={role || "operator"}
                                    canViewRecords={canViewRecords}
                                    canDoFullLog={canDoFullLog}
                                    isAdmin={isAdmin}
                                />
                                <div className="mt-auto border-t pt-4 pb-2">
                                    <p className="text-xs text-center text-muted-foreground font-mono">BoilerOps {getAppVersion()}</p>
                                    <p className="text-[10px] text-center text-muted-foreground">Updated: {LAST_UPDATED}</p>
                                </div>
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
                            <form action={logout}>
                                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-destructive hover:text-white rounded-full ml-1" title="Sign Out">
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">Sign out</span>
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </header >
    );
}
