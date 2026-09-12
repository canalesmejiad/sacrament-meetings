import { headers } from "next/headers";

import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

async function fetchMeetings(): Promise<SacramentMeeting[]> {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");

    if (!host) {
        throw new Error("Unable to determine the application host.");
    }

    const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
    const protocol =
        forwardedProtocol ?? (host.includes("localhost") ? "http" : "https");

    const response = await fetch(
        `${protocol}://${host}/api/meetings`,
        { cache: "no-store" },
    );

    if (!response.ok) {
        throw new Error("Unable to load the meetings.");
    }

    return response.json() as Promise<SacramentMeeting[]>;
}

export default async function MeetingsPage() {
    const meetings = await fetchMeetings();

    return (
        <section aria-labelledby="meetings-heading">
            <div className="max-w-2xl">
                <p className="font-semibold uppercase tracking-widest text-sky-700">
                    Meeting archive
                </p>

                <h1
                    id="meetings-heading"
                    className="mt-2 text-4xl font-bold tracking-tight text-slate-900"
                >
                    Sacrament meetings
                </h1>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Select a Sunday to review its complete meeting program.
                </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {meetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </div>
        </section>
    );
}