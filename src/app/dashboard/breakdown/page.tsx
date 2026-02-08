import { db } from "@/db";
import { breakdowns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BreakdownForm } from "@/components/forms/breakdown-form";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import Link from "next/link";

export default async function BreakdownPage() {
    const activeBreakdowns = await db.select().from(breakdowns).where(eq(breakdowns.status, "active"));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-destructive">Breakdown Reporting</h1>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/records">
                        <History className="mr-2 h-4 w-4" /> View History
                    </Link>
                </Button>
            </div>
            <BreakdownForm activeBreakdowns={activeBreakdowns} />
        </div>
    );
}
