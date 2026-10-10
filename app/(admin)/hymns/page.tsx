import type { Metadata } from "next";
import Link from "next/link";

import DeleteHymnButton from "@/components/DeleteHymnButton";
import { getHymns } from "@/lib/hymns-db";

export const metadata: Metadata = {
    title: "Hymn catalog",
    description: "Manage hymn numbers and titles for sacrament meetings.",
};

const successMessages = {
    created: "The hymn was created successfully.",
    updated: "The hymn was updated successfully.",
    deleted: "The hymn was deleted successfully.",
} as const;

interface HymnsPageProps {
    searchParams: Promise<{ success?: string }>;
}

export default async function HymnsPage({
    searchParams,
}: HymnsPageProps) {
    const params = await searchParams;
    const hymns = await getHymns();

    const successMessage =
        typeof params.success === "string" &&
            Object.prototype.hasOwnProperty.call(successMessages, params.success)
            ? successMessages[params.success as keyof typeof successMessages]
            : undefined;

    return (
        <section aria-labelledby="hymns-heading">
            {successMessage && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
                >
                    <p>{successMessage}</p>
                    <Link
                        href="/hymns"
                        className="mt-2 inline-block font-semibold underline"
                    >
                        Dismiss
                    </Link>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1
                        id="hymns-heading"
                        className="text-3xl font-bold text-slate-900"
                    >
                        Hymn catalog
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Manage hymn numbers and titles for meeting preparation.
                        Use these details when completing a meeting program.
                    </p>
                </div>

                <Link
                    href="/hymns/new"
                    className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                >
                    Create hymn
                </Link>
            </div>

            {hymns.length === 0 ? (
                <p
                    role="status"
                    className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-700"
                >
                    No hymns have been added. Create a hymn to start the catalog.
                </p>
            ) : (
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                    {hymns.map((hymn) => (
                        <li
                            key={hymn.id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <p className="font-semibold text-sky-800">
                                Hymn #{hymn.number}
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-slate-900">
                                {hymn.title}
                            </h2>

                            <div className="mt-5 flex flex-wrap items-start gap-3">
                                <Link
                                    href={`/hymns/${hymn.id}/edit`}
                                    className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                                >
                                    Edit
                                </Link>

                                <DeleteHymnButton
                                    id={hymn.id}
                                    title={hymn.title}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}