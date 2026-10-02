"use client";

import { useActionState } from "react";

import { authenticate } from "@/app/login/actions";

export default function LoginForm() {
    const [errorMessage, formAction, isPending] =
        useActionState(authenticate, undefined);

    return (
        <form action={formAction} className="space-y-4">
            <input
                type="hidden"
                name="redirectTo"
                value="/meetings/new"
            />

            <div className="space-y-1">
                <label
                    htmlFor="email"
                    className="block font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border px-3 py-2"
                />
            </div>

            <div className="space-y-1">
                <label
                    htmlFor="password"
                    className="block font-medium"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border px-3 py-2"
                />
            </div>

            {errorMessage && (
                <p
                    id="login-error"
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
                >
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                aria-disabled={isPending}
                className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}