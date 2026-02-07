import { AttendanceForm } from "@/components/forms/attendance-form";

export default function AttendancePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <AttendanceForm />
        </div>
    );
}
