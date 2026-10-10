"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deleteHymn, type HymnFormState } from "@/app/hymn-actions";

interface DeleteHymnButtonProps {
    id: number;
    title: string;
}

function DeleteButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-red-700 px-4 py-2 font-semibold text-red-800 hover:bg-red-50 disabled:opacity-60"
        >
            {pending ? "Deleting..." : "Delete"}
        </button>
    );
}

export default function DeleteHymnButton({
    id,
    title,
}: DeleteHymnButtonProps) {
    const action = deleteHymn.bind(null, id);
    const [state, formAction] = useActionState<HymnFormState, FormData>(
        action,
        {},
    );

    return (
        <form
            action={formAction}
            onSubmit={(event) => {
                if (!window.confirm(`Delete "${title}" from the hymn catalog?`)) {
                    event.preventDefault();
                }
            }}
            className="space-y-2"
        >
            <DeleteButton />

            {state.message && (
                <p role="alert" className="text-sm text-red-800">
                    {state.message}
                </p>
            )}
        </form>
    );
}