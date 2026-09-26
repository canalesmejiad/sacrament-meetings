"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
    deleteMeeting,
    type MeetingFormState,
} from "@/app/actions";

interface MeetingActionsProps {
    meetingId: number;
}

function DeleteButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Deleting..." : "Delete meeting"}
        </button>
    );
}

export default function MeetingActions({
    meetingId,
}: MeetingActionsProps) {
    const initialState: MeetingFormState = {
        errors: {},
        message: "",
    };

    const deleteMeetingWithId = deleteMeeting.bind(
        null,
        meetingId,
    );

    const [state, formAction] = useActionState(
        deleteMeetingWithId,
        initialState,
    );

    return (
        <div className="no-print mt-6">
            <div className="flex flex-wrap justify-center gap-3">
                <Link
                    href={`/meetings/${meetingId}/edit`}
                    className="rounded-md bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900"
                >
                    Edit meeting
                </Link>

                <form
                    action={formAction}
                    onSubmit={(event) => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this meeting?",
                        );

                        if (!confirmed) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DeleteButton />
                </form>
            </div>

            {state.message && (
                <p
                    role="alert"
                    aria-live="polite"
                    className="mt-3 rounded-lg bg-red-50 p-3 text-red-800"
                >
                    {state.message}
                </p>
            )}
        </div>
    );
}