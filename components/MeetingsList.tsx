"use client";

import { useEffect, useState } from "react";

import MeetingCard from "@/components/MeetingCard";
import Pagination from "@/components/Pagination";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingsListProps {
    query: string;
    currentPage: number;
    success: string;
}

interface MeetingsResponse {
    data: SacramentMeeting[];
    pagination: { page: number; limit: number; totalPages: number };
}

type RequestResult = {
    key: string;
    data?: MeetingsResponse;
    error?: string;
};

export default function MeetingsList({
    query,
    currentPage,
    success,
}: MeetingsListProps) {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<RequestResult | null>(null);
    const requestKey = JSON.stringify([query, currentPage, success, attempt]);

    useEffect(() => {
        const controller = new AbortController();
        const params = new URLSearchParams({
            date: query,
            page: String(currentPage),
            limit: "5",
        });

        async function loadMeetings() {
            try {
                const response = await fetch(`/api/meetings?${params}`, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Unable to load meetings.");
                }

                const data: MeetingsResponse = await response.json();
                if (!Array.isArray(data.data) || !data.pagination) {
                    throw new Error("Unexpected meetings response.");
                }

                if (!controller.signal.aborted) {
                    setResult({ key: requestKey, data });
                }
            } catch {
                if (!controller.signal.aborted) {
                    setResult({
                        key: requestKey,
                        error: "Meetings could not be loaded. Please try again.",
                    });
                }
            }
        }

        void loadMeetings();
        return () => controller.abort();
    }, [query, currentPage, requestKey]);

    if (result?.key !== requestKey) {
        return (
            <p role="status" className="mt-10 text-slate-700">
                Loading meetings...
            </p>
        );
    }

    if (result.error) {
        return (
            <div role="alert" className="mt-10 rounded-xl bg-red-50 p-6 text-red-900">
                <p>{result.error}</p>
                <button
                    type="button"
                    onClick={() => setAttempt((previous) => previous + 1)}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                    Try again
                </button>
            </div>
        );
    }

    const data = result.data;
    if (!data || data.data.length === 0) {
        return (
            <p role="status" className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
                No meetings matched your search.
            </p>
        );
    }

    return (
        <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </div>
            <Pagination currentPage={data.pagination.page} totalPages={data.pagination.totalPages} />
        </>
    );
}
