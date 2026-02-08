
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface NavLinksProps {
    role: string;
    canViewRecords: boolean;
    isAdmin: boolean;
}

export function NavLinks({ role, canViewRecords, isAdmin }: NavLinksProps) {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        ...(canViewRecords ? [{ href: "/dashboard/attendance", label: "Attendance" }] : []),
        { href: "/dashboard/shift-log", label: "Shift Logs" },
        { href: "/dashboard/breakdown", label: "Breakdown" },
        ...(canViewRecords ? [{ href: "/dashboard/records", label: "Records" }] : []),
    ];

    return (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "transition-all py-2 hover:text-white",
                            isActive
                                ? "border-b-2 border-white font-bold text-white"
                                : "border-b-2 border-transparent hover:border-white/50 text-white/80 hover:text-white"
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}

            {/* Admin Link Special Styling */}
            {isAdmin && (
                <Link
                    href="/dashboard/admin"
                    className={cn(
                        "flex items-center gap-1 transition-all py-2 hover:text-white",
                        pathname === "/dashboard/admin"
                            ? "border-b-2 border-white font-bold text-white"
                            : "border-b-2 border-transparent hover:border-white/50 text-destructive font-bold hover:text-red-200"
                    )}
                >
                    <Shield className="h-4 w-4" />
                    Admin
                </Link>
            )}
        </nav>
    );
}
