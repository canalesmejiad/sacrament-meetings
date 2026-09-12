"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingPageProps {
    params: Promise<{ id: string }>;
}

export default function MeetingPage({ params }: MeetingPageProps) {
    const { id } = use(params);

    const [meeting, setMeeting] = useState<
        SacramentMeeting | null | undefined
    >(undefined);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMeeting() {
            try {
                const response = await fetch(
                    `/api/meetings/${encodeURIComponent(id)}`,
                );

                if (response.status === 404) {
                    setMeeting(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load the meeting.");
                }

                const data =
                    (await response.json()) as SacramentMeeting;

                setMeeting(data);
            } catch {
                setError("The meeting could not be loaded.");
            }
        }

        void loadMeeting();
    }, [id]);

    if (error) {
        return (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800"
            >
                {error}
            </div>
        );
    }

    if (meeting === undefined) {
        return (
            <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-sky-200 bg-sky-50 p-6 text-sky-900"
            >
                Loading meeting program...
            </div>
        );
    }

    if (meeting === null) {
        return (
            <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Meeting not found
                </h1>

                <Link
                    href="/meetings"
                    className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                    Return to all meetings
                </Link>
            </section>
        );
    }

    return <MeetingDetail meeting={meeting} />;
}