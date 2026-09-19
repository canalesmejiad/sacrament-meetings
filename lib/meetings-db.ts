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
    void data;

    throw new Error(
        "addMeeting: database implementation coming in Week 04",
    );
}

export async function updateMeeting(
    id: number,
    data: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
    void id;
    void data;

    throw new Error(
        "updateMeeting: database implementation coming in Week 04",
    );
}

export async function deleteMeeting(id: number): Promise<boolean> {
    void id;

    throw new Error(
        "deleteMeeting: database implementation coming in Week 04",
    );
}