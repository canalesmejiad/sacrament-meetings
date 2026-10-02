import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingPageProps {
    params: Promise<{ id: string }>;
}

const getMeeting = cache(getMeetingById);

const meetingTypeLabels: Record<
    SacramentMeeting["meetingType"],
    string
> = {
    testimony: "Testimony",
    regular: "Regular",
    stake: "Stake",
    general: "General Conference",
    special: "Special",
};

function formatMeetingDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        },
    );
}

export async function generateMetadata({
    params,
}: MeetingPageProps): Promise<Metadata> {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
        return {
            title: "Meeting Not Found",
        };
    }

    const meeting = await getMeeting(meetingId);

    if (!meeting) {
        return {
            title: "Meeting Not Found",
        };
    }

    const formattedDate = formatMeetingDate(meeting.date);
    const meetingType =
        meetingTypeLabels[meeting.meetingType];

    const title = `${meetingType} Meeting — ${formattedDate}`;
    const description =
        `View the sacrament meeting program for ${formattedDate}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
        },
    };
}

export default async function MeetingPage({
    params,
}: MeetingPageProps) {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
        notFound();
    }

    const meeting = await getMeeting(meetingId);

    if (!meeting) {
        notFound();
    }

    return <MeetingDetail meeting={meeting} />;
}