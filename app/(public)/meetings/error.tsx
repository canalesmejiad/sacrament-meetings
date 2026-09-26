"use client";

import Link from "next/link";
import { useEffect } from "react";

interface MeetingsErrorProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

export default function MeetingsError({
    error,
    reset,
}: MeetingsErrorProps) {
    useEffect(() => {
        console.error("Meetings route error:", error);
    }, [error]);

    return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
            <div
                role="alert"
                className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
            >
                <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
                    Something went wrong
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    We could not load the meetings
                </h1>

                <p className="mt-4 text-slate-600">
                    Please try again. If the problem continues,
                    return to the meetings page.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-md bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
                    >
                        Try again
                    </button>

                    <Link
                        href="/meetings"
                        className="rounded-md border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Return to meetings
                    </Link>
                </div>
            </div>
        </main>
    );
}
