import { BreakdownForm } from "@/components/forms/breakdown-form";

export default function BreakdownPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-destructive">Breakdown Reporting</h1>
            <BreakdownForm />
        </div>
    );
}
