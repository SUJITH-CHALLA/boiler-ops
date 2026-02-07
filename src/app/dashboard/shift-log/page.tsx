import { ShiftLogForm } from "@/components/forms/shift-log-form";

export default function ShiftLogPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Shift Log Entry</h1>
            <ShiftLogForm />
        </div>
    );
}
