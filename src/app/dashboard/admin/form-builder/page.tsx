
import { db } from "@/db";
import { formFields } from "@/db/schema";
import { desc } from "drizzle-orm";
import { FormFieldManager } from "@/components/admin/form-field-manager";

export default async function FormBuilderPage() {
    const fields = await db.select().from(formFields).orderBy(desc(formFields.id));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Form Configuration</h1>
                <p className="text-muted-foreground">Add or remove columns for operator hourly logs.</p>
            </div>
            <FormFieldManager fields={fields} />
        </div>
    );
}
