import type { Metadata } from "next";

import { createHymn } from "@/app/hymn-actions";
import HymnForm from "@/components/HymnForm";

export const metadata: Metadata = {
    title: "Create hymn",
    description: "Add a hymn to the sacrament meeting hymn catalog.",
};

export default function CreateHymnPage() {
    return (
        <section
            aria-labelledby="create-hymn-heading"
            className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <h1
                id="create-hymn-heading"
                className="text-2xl font-bold text-slate-900"
            >
                Create a hymn
            </h1>

            <p className="mb-6 mt-2 text-slate-600">
                Add a hymn number and title to the catalog.
            </p>

            <HymnForm action={createHymn} submitLabel="Create hymn" />
        </section>
    );
}