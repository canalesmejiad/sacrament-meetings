import type { NextAuthConfig } from "next-auth";

const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth }) {
            return Boolean(auth?.user);
        },
    },
    providers: [],
} satisfies NextAuthConfig;

export default authConfig;