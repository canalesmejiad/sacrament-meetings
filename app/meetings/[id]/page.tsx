import { headers } from "next/headers";
import { notFound } from "next/navigation";

import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function fetchMeeting(
    id: string,
): Promise<SacramentMeeting | null> {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");

    if (!host) {
        throw new Error("Unable to determine the application host.");
    }

    const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
    const protocol =
        forwardedProtocol ?? (host.includes("localhost") ? "http" : "https");

    const response = await fetch(
        `${protocol}://${host}/api/meetings/${encodeURIComponent(id)}`,
        { cache: "no-store" },
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Unable to load the meeting.");
    }

    return response.json() as Promise<SacramentMeeting>;
}

export default async function MeetingPage({
    params,
}: MeetingPageProps) {
    const { id } = await params;
    const meeting = await fetchMeeting(id);

    if (!meeting) {
        notFound();
    }

    return <MeetingDetail meeting={meeting} />;
}