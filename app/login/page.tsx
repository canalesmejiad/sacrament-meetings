import type { Metadata } from "next";

import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
    title: "Sign In",
    description:
        "Sign in to manage sacrament meeting programs.",
};

export default function LoginPage() {
    return (
        <main className="mx-auto max-w-md space-y-6 rounded-xl border p-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Bishopric Login
                </h1>

                <p className="text-gray-600">
                    Sign in to manage sacrament meetings.
                </p>
            </div>

            <LoginForm />
        </main>
    );
}