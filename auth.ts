import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import authConfig from "./auth.config";

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const result =
                    credentialsSchema.safeParse(credentials);

                if (!result.success) {
                    return null;
                }

                const { email, password } = result.data;
                const validEmail =
                    process.env.ADMIN_EMAIL?.toLowerCase();
                const passwordHash =
                    process.env.ADMIN_PASSWORD_HASH;

                if (!validEmail || !passwordHash) {
                    return null;
                }

                const emailMatches =
                    email.toLowerCase() === validEmail;

                const passwordMatches = await bcrypt.compare(
                    password,
                    passwordHash,
                );

                if (!emailMatches || !passwordMatches) {
                    return null;
                }

                return {
                    id: "bishopric-admin",
                    name: "Bishopric Administrator",
                    email: validEmail,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
});