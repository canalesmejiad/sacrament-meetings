import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export interface CatalogHymn {
    id: number;
    number: number;
    title: string;
}

export async function getHymns(): Promise<CatalogHymn[]> {
    const rows = await sql`
        SELECT id, number, title
        FROM hymns
        ORDER BY number ASC
    `;

    return rows as CatalogHymn[];
}

export async function getHymnById(
    id: number,
): Promise<CatalogHymn | null> {
    const rows = await sql`
        SELECT id, number, title
        FROM hymns
        WHERE id = ${id}
    `;

    return (rows[0] as CatalogHymn | undefined) ?? null;
}

export async function addHymn(
    number: number,
    title: string,
): Promise<CatalogHymn> {
    const rows = await sql`
        INSERT INTO hymns (number, title)
        VALUES (${number}, ${title})
        RETURNING id, number, title
    `;

    return rows[0] as CatalogHymn;
}

export async function updateHymn(
    id: number,
    number: number,
    title: string,
): Promise<CatalogHymn | null> {
    const rows = await sql`
        UPDATE hymns
        SET number = ${number}, title = ${title}
        WHERE id = ${id}
        RETURNING id, number, title
    `;

    return (rows[0] as CatalogHymn | undefined) ?? null;
}

export async function deleteHymn(id: number): Promise<boolean> {
    const rows = await sql`
        DELETE FROM hymns
        WHERE id = ${id}
        RETURNING id
    `;

    return rows.length > 0;
}   