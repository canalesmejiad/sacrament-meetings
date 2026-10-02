import { NextRequest, NextResponse } from "next/server";

import {
    getMeetings,
    getMeetingsTotalPages,
} from "@/lib/meetings-db";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 100;

function parsePositiveInteger(
    value: string | null,
    defaultValue: number,
): number | null {
    if (value === null) {
        return defaultValue;
    }

    if (!/^\d+$/.test(value)) {
        return null;
    }

    const parsedValue = Number(value);

    if (
        !Number.isSafeInteger(parsedValue) ||
        parsedValue < 1
    ) {
        return null;
    }

    return parsedValue;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("date") ?? "";
    const page = parsePositiveInteger(
        searchParams.get("page"),
        DEFAULT_PAGE,
    );
    const limit = parsePositiveInteger(
        searchParams.get("limit"),
        DEFAULT_LIMIT,
    );

    if (page === null) {
        return NextResponse.json(
            {
                error: "Invalid pagination parameters.",
                details: {
                    page: "The page parameter must be a positive integer.",
                },
            },
            { status: 400 },
        );
    }

    if (limit === null || limit > MAX_LIMIT) {
        return NextResponse.json(
            {
                error: "Invalid pagination parameters.",
                details: {
                    limit:
                        "The limit parameter must be a positive integer between 1 and 100.",
                },
            },
            { status: 400 },
        );
    }

    const [meetings, totalPages] = await Promise.all([
        getMeetings(query, page, limit),
        getMeetingsTotalPages(query, limit),
    ]);

    return NextResponse.json({
        data: meetings,
        pagination: {
            page,
            limit,
            totalPages,
        },
    });
}