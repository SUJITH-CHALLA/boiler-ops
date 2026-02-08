
import { db } from "@/db";
import { formFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HourlyLogForm } from "@/components/forms/hourly-log-form";

export default async function HourlyLogPage() {
    const fields = await db.select().from(formFields).where(eq(formFields.isActive, true)).orderBy(formFields.order);

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Hourly Data Entry</h1>
                <p className="text-muted-foreground mt-2">
                    Record readings for the current hour. Ensure accuracy as this data is used for shift averages.
                </p>
            </div>
            <HourlyLogForm fields={fields} />
        </div>
    );
}
