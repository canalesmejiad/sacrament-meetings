import { neon } from "@neondatabase/serverless";

import type { SacramentMeeting } from "./types";

const sql = neon(process.env.DATABASE_URL!);
const ITEMS_PER_PAGE = 5;

export async function getMeetings(
    query = "",
    currentPage = 1,
): Promise<SacramentMeeting[]> {
    const searchTerm = `%${query.trim()}%`;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const rows = await sql`
        SELECT
            id,
            to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type AS "meetingType",
            presiding,
            conducting,
            announcements,
            opening_hymn AS "openingHymn",
            opening_prayer AS "openingPrayer",
            ward_business AS "wardBusiness",
            stake_business AS "stakeBusiness",
            sacrament_hymn AS "sacramentHymn",
            speakers,
            closing_hymn AS "closingHymn",
            closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE
            to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
            OR presiding ILIKE ${searchTerm}
            OR conducting ILIKE ${searchTerm}
            OR meeting_type ILIKE ${searchTerm}
            OR speakers::text ILIKE ${searchTerm}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE}
        OFFSET ${offset}
    `;

    return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
    query = "",
): Promise<number> {
    const searchTerm = `%${query.trim()}%`;

    const rows = await sql`
        SELECT COUNT(*) AS count
        FROM meetings
        WHERE
            to_char(date, 'YYYY-MM-DD') ILIKE ${searchTerm}
            OR presiding ILIKE ${searchTerm}
            OR conducting ILIKE ${searchTerm}
            OR meeting_type ILIKE ${searchTerm}
            OR speakers::text ILIKE ${searchTerm}
    `;

    return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
    id: number,
): Promise<SacramentMeeting | null> {
    const rows = await sql`
        SELECT
            id,
            to_char(date, 'YYYY-MM-DD') AS "date",
            meeting_type AS "meetingType",
            presiding,
            conducting,
            announcements,
            opening_hymn AS "openingHymn",
            opening_prayer AS "openingPrayer",
            ward_business AS "wardBusiness",
            stake_business AS "stakeBusiness",
            sacrament_hymn AS "sacramentHymn",
            speakers,
            closing_hymn AS "closingHymn",
            closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE id = ${id}
    `;

    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function addMeeting(
    data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
    const rows = await sql`
        INSERT INTO meetings (
            date,
            meeting_type,
            presiding,
            conducting,
            announcements,
            opening_hymn,
            opening_prayer,
            ward_business,
            stake_business,
            sacrament_hymn,
            speakers,
            closing_hymn,
            closing_prayer
        )
        VALUES (
            ${data.date}::date,
            ${data.meetingType},
            ${data.presiding},
            ${data.conducting},
            ARRAY(
                SELECT jsonb_array_elements_text(
                    ${JSON.stringify(
        data.announcements ?? [],
    )
        }::jsonb
                )
            ),
            ${JSON.stringify(data.openingHymn)}::jsonb,
            ${data.openingPrayer},
            ${JSON.stringify(data.wardBusiness ?? [])}::jsonb,
            ${data.stakeBusiness},
            ${JSON.stringify(data.sacramentHymn)}::jsonb,
            ${JSON.stringify(data.speakers)}::jsonb,
            ${JSON.stringify(data.closingHymn)}::jsonb,
            ${data.closingPrayer}
        )
        RETURNING id
    `;

    const meeting = await getMeetingById(Number(rows[0].id));

    if (!meeting) {
        throw new Error(
            "The created meeting could not be retrieved.",
        );
    }

    return meeting;
}

export async function updateMeeting(
    id: number,
    data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting | null> {
    const rows = await sql`
        UPDATE meetings
        SET
            date = ${data.date}::date,
            meeting_type = ${data.meetingType},
            presiding = ${data.presiding},
            conducting = ${data.conducting},
            announcements = ARRAY(
                SELECT jsonb_array_elements_text(
                    ${JSON.stringify(
        data.announcements ?? [],
    )
        }::jsonb
                )
            ),
            opening_hymn = ${JSON.stringify(data.openingHymn)
        }::jsonb,
            opening_prayer = ${data.openingPrayer},
            ward_business = ${JSON.stringify(data.wardBusiness ?? [])
        }::jsonb,
            stake_business = ${data.stakeBusiness},
            sacrament_hymn = ${JSON.stringify(data.sacramentHymn)
        }::jsonb,
            speakers = ${JSON.stringify(data.speakers)}::jsonb,
            closing_hymn = ${JSON.stringify(data.closingHymn)
        }::jsonb,
            closing_prayer = ${data.closingPrayer}
        WHERE id = ${id}
        RETURNING id
    `;

    if (rows.length === 0) {
        return null;
    }

    return getMeetingById(id);
}

export async function deleteMeeting(id: number): Promise<boolean> {
    const rows = await sql`
        DELETE FROM meetings
        WHERE id = ${id}
        RETURNING id
    `;

    return rows.length > 0;
}