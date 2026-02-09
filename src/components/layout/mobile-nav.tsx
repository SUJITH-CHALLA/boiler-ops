"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ClipboardList, PenTool, AlertTriangle, History, Shield } from "lucide-react";

interface MobileNavProps {
    role: string;
    canViewRecords: boolean;
    canDoFullLog: boolean;
    isAdmin: boolean;
    onItemClick?: () => void;
}

export function MobileNav({ role, canViewRecords, canDoFullLog, isAdmin, onItemClick }: MobileNavProps) {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            visible: true
        },
        {
            href: "/dashboard/attendance",
            label: "Attendance",
            icon: ClipboardList,
            visible: canViewRecords && role !== "manager"
        },
        {
            href: "/dashboard/shift-log/hourly",
            label: "Hourly Logs",
            icon: ClipboardList,
            visible: role === "operator"
        },
        {
            href: "/dashboard/records",
            label: "Shift Summary",
            icon: PenTool,
            visible: role === "manager"
        },
        {
            href: "/dashboard/shift-log",
            label: "Shift Log",
            icon: PenTool,
            visible: !role.includes("manager") && canDoFullLog // Using logic from original navbar
        },
        {
            href: "/dashboard/breakdown",
            label: "Report Breakdown",
            icon: AlertTriangle,
            visible: role !== "manager",
            textColor: "text-destructive"
        },
        {
            href: "/dashboard/records",
            label: "Records History",
            icon: History,
            visible: canViewRecords && role !== "manager"
        },
        {
            href: "/dashboard/admin",
            label: "Admin Console",
            icon: Shield,
            visible: isAdmin,
            textColor: "text-primary"
        }
    ];

    // Deduplicate logic for "Shift Summary" / "Records History" pointing to same path if needed, 
    // but here they are context specific. Original code had some overlaps or conditional rendering.
    // I'll strictly follow the props logic.

    return (
        <nav className="mt-8 flex flex-col gap-2">
            {links.filter(l => l.visible).map((link, idx) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                    <Link
                        key={`${link.href}-${idx}`}
                        href={link.href}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-[#1E3A5F] text-white shadow-md border-l-4 border-blue-400 pl-2" // Active State: Deep Navy + Line/Padding
                                : "hover:bg-muted text-foreground",
                            link.textColor && !isActive ? link.textColor : ""
                        )}
                    >
                        <Icon className={cn("h-5 w-5", isActive ? "text-blue-300" : "")} />
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
