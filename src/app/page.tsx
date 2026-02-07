import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-12 px-6 text-center w-full">
      <div className="max-w-2xl space-y-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
          Industrial Boiler Logbook
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
          Secure, digital shift logging for industrial boiler operations.
          Replace paper logs with reliable timestamped data.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-4 sm:max-w-md sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg h-12">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 text-lg h-12">
          <Link href="mailto:admin@boilerops.internal?subject=Request Access">Request Access</Link>
        </Button>
      </div>

      {/* Color Palette Test */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs font-mono">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-primary shadow-sm" />
          <span>Primary</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-secondary shadow-sm" />
          <span>Secondary</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-accent shadow-sm" />
          <span>Accent</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-destructive shadow-sm" />
          <span>Destructive</span>
        </div>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        © 2026 BoilerOps. Internal Tool.
      </div>
    </div>
  );
}
