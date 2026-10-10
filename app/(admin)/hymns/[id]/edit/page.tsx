import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateHymn } from "@/app/hymn-actions";
import HymnForm from "@/components/HymnForm";
import { getHymnById } from "@/lib/hymns-db";

export const metadata: Metadata = {
    title: "Edit hymn",
    description: "Update a hymn in the sacrament meeting hymn catalog.",
};

interface EditHymnPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditHymnPage({
    params,
}: EditHymnPageProps) {
    const { id } = await params;
    const hymnId = Number(id);

    if (!Number.isSafeInteger(hymnId) || hymnId < 1) {
        notFound();
    }

    const hymn = await getHymnById(hymnId);

    if (!hymn) {
        notFound();
    }

    const action = updateHymn.bind(null, hymn.id);

    return (
        <section
            aria-labelledby="edit-hymn-heading"
            className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <h1
                id="edit-hymn-heading"
                className="text-2xl font-bold text-slate-900"
            >
                Edit hymn
            </h1>

            <p className="mb-6 mt-2 text-slate-600">
                Update the hymn number or title.
            </p>

            <HymnForm
                action={action}
                hymn={hymn}
                submitLabel="Save changes"
            />
        </section>
    );
}