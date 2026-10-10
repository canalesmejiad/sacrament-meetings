"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { HymnFormState } from "@/app/hymn-actions";
import type { CatalogHymn } from "@/lib/hymns-db";

interface HymnFormProps {
    action: (
        state: HymnFormState,
        formData: FormData,
    ) => Promise<HymnFormState>;
    hymn?: CatalogHymn;
    submitLabel: string;
}

const inputStyles =
    "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 aria-invalid:border-red-600";

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
            {pending ? "Saving..." : label}
        </button>
    );
}

export default function HymnForm({
    action,
    hymn,
    submitLabel,
}: HymnFormProps) {
    const [state, formAction] = useActionState<HymnFormState, FormData>(
        action,
        {},
    );

    const [number, setNumber] = useState(
        hymn?.number.toString() ?? "",
    );
    const [title, setTitle] = useState(hymn?.title ?? "");

    return (
        <form action={formAction} noValidate className="space-y-6">
            {state.message && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900"
                >
                    <p>{state.message}</p>
                    {state.errors && (
                        <ul className="mt-2 list-disc pl-5">
                            {Object.entries(state.errors).map(
                                ([field, errors]) =>
                                    errors?.length ? (
                                        <li key={field}>
                                            <a
                                                href={`#hymn-${field}`}
                                                className="underline"
                                            >
                                                {field === "number"
                                                    ? "Hymn number"
                                                    : "Hymn title"}
                                            </a>
                                            : {errors[0]}
                                        </li>
                                    ) : null,
                            )}
                        </ul>
                    )}
                </div>
            )}

            <div>
                <label
                    htmlFor="hymn-number"
                    className="block font-medium text-slate-800"
                >
                    Hymn number
                </label>
                <input
                    id="hymn-number"
                    name="number"
                    type="number"
                    min="1"
                    max="999"
                    required
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    aria-invalid={Boolean(state.errors?.number?.length)}
                    aria-describedby={
                        state.errors?.number?.length
                            ? "hymn-number-error"
                            : undefined
                    }
                    className={inputStyles}
                />
                {state.errors?.number?.length && (
                    <div
                        id="hymn-number-error"
                        className="mt-2 text-sm text-red-700"
                    >
                        {state.errors.number.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label
                    htmlFor="hymn-title"
                    className="block font-medium text-slate-800"
                >
                    Hymn title
                </label>
                <input
                    id="hymn-title"
                    name="title"
                    required
                    maxLength={150}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    aria-invalid={Boolean(state.errors?.title?.length)}
                    aria-describedby={
                        state.errors?.title?.length
                            ? "hymn-title-error"
                            : undefined
                    }
                    className={inputStyles}
                />
                {state.errors?.title?.length && (
                    <div
                        id="hymn-title-error"
                        className="mt-2 text-sm text-red-700"
                    >
                        {state.errors.title.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                <SubmitButton label={submitLabel} />
                <Link
                    href="/hymns"
                    className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}