import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize(credentials) {
                const result = credentialsSchema.safeParse(credentials);

                if (!result.success) {
                    return null;
                }

                const { email, password } = result.data;
                const validEmail = process.env.ADMIN_EMAIL;
                const validPassword = process.env.ADMIN_PASSWORD;

                if (!validEmail || !validPassword) {
                    return null;
                }

                if (email !== validEmail || password !== validPassword) {
                    return null;
                }

                return {
                    id: "bishopric-admin",
                    name: "Bishopric Administrator",
                    email,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
});
