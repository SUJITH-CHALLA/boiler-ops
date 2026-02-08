import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 md:gap-10 px-4 py-8 md:py-12 relative text-center">
      {/* Fixed Background - with inline styles to force viewport coverage */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: -50,
          pointerEvents: 'none'
        }}
        className="bg-[#1E3A5F]"
        aria-hidden="true"
      >
        {/* Desktop Background */}
        <img
          src="/login-bg-desktop.jpg"
          alt=""
          className="hidden md:block w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 hidden md:block" />
      </div>

      <div className="max-w-2xl space-y-6 z-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight drop-shadow-md">
          Industrial Boiler Logbook
        </h2>
        <p className="text-lg text-gray-200 leading-relaxed max-w-md mx-auto font-medium shadow-sm">
          Secure, digital shift logging for industrial boiler operations.
          Replace paper logs with reliable timestamped data.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-4 sm:max-w-md sm:flex-row sm:justify-center z-10">
        <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg h-12 shadow-lg border border-white/20">
          <Link href="/login">Login</Link>
        </Button>
      </div>

      <div className="mt-8 text-sm text-gray-300 z-10">
        © 2026 BoilerOps. Internal Tool.
      </div>
    </div>
  );
}
