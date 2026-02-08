
"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonsProps {
    data: any[];
    filename: string;
    type: "shift-logs" | "attendance" | "breakdowns" | "hourly";
}

export function ExportButtons({ data, filename, type }: ExportButtonsProps) {

    const convertToCSV = (objArray: any[]) => {
        if (objArray.length === 0) return "";
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        // Get headers
        const headers = Object.keys(array[0]);
        str += headers.join(',') + '\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ',';

                let val = array[i][index];
                // Handle objects or dates
                if (val instanceof Date) {
                    val = val.toISOString();
                } else if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val).replace(/,/g, ';'); // Replace commas in JSON to not break CSV
                }

                // Escape quotes
                if (typeof val === 'string') {
                    val = `"${val.replace(/"/g, '""')}"`;
                }

                line += val;
            }
            str += line + '\r\n';
        }
        return str;
    };

    const downloadCSV = () => {
        try {
            const csvData = convertToCSV(data);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("CSV Report Downloaded");
        } catch (err) {
            toast.error("Failed to generate CSV");
        }
    };

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = filename.replace(/-/g, ' ');

        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                @page { margin: 0; }
                body { margin: 1.6cm 1cm; }
                header, footer, .no-print, nav, [role="tablist"], button { display: none !important; }
            }
        `;
        document.head.appendChild(style);

        window.print();

        document.head.removeChild(style);
        document.title = originalTitle;
        toast.info("Report sent to print/PDF");
    };

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button
                variant="outline"
                size="sm"
                onClick={downloadCSV}
                className="h-8 gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            >
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
            </Button>
        </div>
    );
}
