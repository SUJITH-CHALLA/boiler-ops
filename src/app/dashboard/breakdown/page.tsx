import { db } from "@/db";
import { breakdowns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BreakdownForm } from "@/components/forms/breakdown-form";

export default async function BreakdownPage() {
    const activeBreakdowns = await db.select().from(breakdowns).where(eq(breakdowns.status, "active"));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-destructive">Breakdown Reporting</h1>
            <BreakdownForm activeBreakdowns={activeBreakdowns} />
        </div>
    );
}
