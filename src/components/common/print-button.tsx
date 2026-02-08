"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps extends React.ComponentProps<typeof Button> {
    label?: string;
}

export function PrintButton({ label = "Print", children, ...props }: PrintButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            {...props}
        >
            <Printer className="mr-2 h-4 w-4" />
            {children || label}
        </Button>
    );
}
