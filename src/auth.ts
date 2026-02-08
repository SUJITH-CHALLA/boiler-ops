
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Helper to get user by email
async function getUser(email: string) {
    try {
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return user[0];
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                // Modified to handle both email and simple username login
                const rawEmail = credentials.email as string;
                const emailToUse = rawEmail.includes("@") ? rawEmail : `${rawEmail.toLowerCase().replace(/\s+/g, ".")}@boiler.internal`;

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse({ email: emailToUse, password: credentials.password });

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    try {
                        const user = await getUser(email);
                        if (!user) return null;

                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        if (passwordsMatch) {
                            return {
                                id: user.id.toString(),
                                name: user.name,
                                email: user.email,
                                role: user.role, // Pass role to JWT
                            };
                        }
                    } catch (e) {
                        return null;
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                if (token.sub) {
                    session.user.id = token.sub;
                }
                if (token.role) {
                    // @ts-ignore
                    session.user.role = token.role;
                }
            }
            return session;
        },
        ...authConfig.callbacks,
    },
});
