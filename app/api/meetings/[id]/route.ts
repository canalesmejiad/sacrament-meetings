import { NextResponse } from "next/server";

import { getMeetingById } from "@/lib/meetings-db";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: Request,
    context: RouteContext,
) {
    const { id } = await context.params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId <= 0) {
        return NextResponse.json(
            { error: "The meeting ID must be a valid number." },
            { status: 400 },
        );
    }

    const meeting = getMeetingById(meetingId);

    if (!meeting) {
        return NextResponse.json(
            { error: "Meeting not found." },
            { status: 404 },
        );
    }

    return NextResponse.json(meeting);
}