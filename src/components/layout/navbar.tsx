import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, UserCircle, LayoutDashboard, ClipboardList, PenTool, AlertTriangle, History } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-primary px-4 py-3 text-primary-foreground shadow-sm">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Mobile Menu */}
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
                                <Link href="/dashboard/attendance" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                    <ClipboardList className="h-5 w-5" />
                                    Attendance
                                </Link>
                                <Link href="/dashboard/shift-log" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                    <PenTool className="h-5 w-5" />
                                    Shift Logs
                                </Link>
                                <Link href="/dashboard/breakdown" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    Report Breakdown
                                </Link>
                                <Link href="/dashboard/records" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-foreground">
                                    <History className="h-5 w-5" />
                                    Records
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="text-xl font-bold tracking-tight">
                        BoilerOps
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
                    <Link href="/dashboard/attendance" className="hover:text-accent transition-colors">Attendance</Link>
                    <Link href="/dashboard/shift-log" className="hover:text-accent transition-colors">Shift Logs</Link>
                    <Link href="/dashboard/breakdown" className="hover:text-destructive transition-colors">Breakdown</Link>
                    <Link href="/dashboard/records" className="hover:text-accent transition-colors">Records</Link>
                </nav>

                {/* User / Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20 hover:text-white">
                        <UserCircle className="h-6 w-6" />
                        <span className="sr-only">User profile</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
