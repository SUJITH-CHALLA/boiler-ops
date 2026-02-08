"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="w-full max-w-[100vw] overflow-x-hidden flex min-h-[calc(100vh-4rem)] flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 py-8 relative">

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

            {/* Branding / Quote Section */}
            <div className="max-w-md text-center md:text-left space-y-4 text-white z-10 drop-shadow-md">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">BoilerOps</h1>
                <p className="text-xl font-medium italic text-gray-100">
                    "Digitalize your boiler logs for a safer, smarter future."
                </p>
                <div className="hidden md:block h-1 w-20 bg-accent rounded mt-4 shadow-sm"></div>
            </div>

            {/* Login Form */}
            <Card className="w-full max-w-sm shadow-2xl border-t-4 border-t-primary z-10 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the system.
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Login ID (Username)</Label>
                            <Input id="email" name="email" placeholder="e.g. john.doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {errorMessage && (
                            <div className="text-sm text-destructive font-medium" aria-live="polite">
                                {errorMessage}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-6">
                        <Button className="w-full" size="lg" disabled={isPending}>
                            {isPending ? "Logging in..." : "Sign in"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
