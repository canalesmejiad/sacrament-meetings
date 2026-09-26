"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { MeetingFormState } from "@/app/actions";
import type { SacramentMeeting } from "@/lib/types";

type MeetingAction = (
    state: MeetingFormState,
    formData: FormData,
) => Promise<MeetingFormState>;

interface MeetingFormProps {
    action: MeetingAction;
    meeting?: SacramentMeeting;
    submitLabel: string;
}

interface FieldErrorsProps {
    id: string;
    errors?: string[];
}

const inputStyles =
    "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900";

function FieldErrors({ id, errors }: FieldErrorsProps) {
    if (!errors?.length) {
        return null;
    }

    return (
        <div id={id} className="mt-2 text-sm text-red-700">
            {errors.map((error, index) => (
                <p key={`${error}-${index}`}>{error}</p>
            ))}
        </div>
    );
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Saving..." : label}
        </button>
    );
}

export default function MeetingForm({
    action,
    meeting,
    submitLabel,
}: MeetingFormProps) {
    const initialState: MeetingFormState = {
        errors: {},
        message: "",
    };

    const [state, formAction] = useActionState(
        action,
        initialState,
    );

    const speakers = meeting?.speakers
        .map((speaker) => `${speaker.name} | ${speaker.topic}`)
        .join("\n");

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6"
        >
            <div>
                <label
                    htmlFor="date"
                    className="block font-medium text-slate-800"
                >
                    Meeting date
                </label>
                <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={meeting?.date}
                    aria-invalid={Boolean(state.errors?.date)}
                    aria-describedby={
                        state.errors?.date ? "date-error" : undefined
                    }
                    className={inputStyles}
                />
                <FieldErrors
                    id="date-error"
                    errors={state.errors?.date}
                />
            </div>

            <div>
                <label
                    htmlFor="meetingType"
                    className="block font-medium text-slate-800"
                >
                    Meeting type
                </label>
                <select
                    id="meetingType"
                    name="meetingType"
                    required
                    defaultValue={meeting?.meetingType ?? "regular"}
                    aria-invalid={Boolean(
                        state.errors?.meetingType,
                    )}
                    aria-describedby={
                        state.errors?.meetingType
                            ? "meetingType-error"
                            : undefined
                    }
                    className={inputStyles}
                >
                    <option value="regular">Regular</option>
                    <option value="testimony">Testimony</option>
                    <option value="stake">Stake conference</option>
                    <option value="general">
                        General conference
                    </option>
                    <option value="special">Special</option>
                </select>
                <FieldErrors
                    id="meetingType-error"
                    errors={state.errors?.meetingType}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="presiding"
                        className="block font-medium text-slate-800"
                    >
                        Presiding
                    </label>
                    <input
                        id="presiding"
                        name="presiding"
                        required
                        defaultValue={meeting?.presiding}
                        aria-invalid={Boolean(
                            state.errors?.presiding,
                        )}
                        aria-describedby={
                            state.errors?.presiding
                                ? "presiding-error"
                                : undefined
                        }
                        className={inputStyles}
                    />
                    <FieldErrors
                        id="presiding-error"
                        errors={state.errors?.presiding}
                    />
                </div>

                <div>
                    <label
                        htmlFor="conducting"
                        className="block font-medium text-slate-800"
                    >
                        Conducting
                    </label>
                    <input
                        id="conducting"
                        name="conducting"
                        required
                        defaultValue={meeting?.conducting}
                        aria-invalid={Boolean(
                            state.errors?.conducting,
                        )}
                        aria-describedby={
                            state.errors?.conducting
                                ? "conducting-error"
                                : undefined
                        }
                        className={inputStyles}
                    />
                    <FieldErrors
                        id="conducting-error"
                        errors={state.errors?.conducting}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="announcements"
                    className="block font-medium text-slate-800"
                >
                    Announcements
                </label>
                <p className="text-sm text-slate-600">
                    Enter one announcement per line.
                </p>
                <textarea
                    id="announcements"
                    name="announcements"
                    rows={4}
                    defaultValue={meeting?.announcements?.join("\n")}
                    className={inputStyles}
                />
            </div>

            <fieldset className="rounded-lg border border-slate-200 p-4">
                <legend className="px-2 font-semibold text-slate-900">
                    Opening hymn
                </legend>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="openingHymnNumber"
                            className="block font-medium text-slate-800"
                        >
                            Hymn number
                        </label>
                        <input
                            id="openingHymnNumber"
                            name="openingHymnNumber"
                            type="number"
                            min="1"
                            required
                            defaultValue={
                                meeting?.openingHymn.number
                            }
                            aria-invalid={Boolean(
                                state.errors?.openingHymnNumber,
                            )}
                            aria-describedby={
                                state.errors?.openingHymnNumber
                                    ? "openingHymnNumber-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="openingHymnNumber-error"
                            errors={
                                state.errors?.openingHymnNumber
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="openingHymnTitle"
                            className="block font-medium text-slate-800"
                        >
                            Hymn title
                        </label>
                        <input
                            id="openingHymnTitle"
                            name="openingHymnTitle"
                            required
                            defaultValue={
                                meeting?.openingHymn.title
                            }
                            aria-invalid={Boolean(
                                state.errors?.openingHymnTitle,
                            )}
                            aria-describedby={
                                state.errors?.openingHymnTitle
                                    ? "openingHymnTitle-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="openingHymnTitle-error"
                            errors={
                                state.errors?.openingHymnTitle
                            }
                        />
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="openingPrayer"
                    className="block font-medium text-slate-800"
                >
                    Opening prayer
                </label>
                <input
                    id="openingPrayer"
                    name="openingPrayer"
                    required
                    defaultValue={meeting?.openingPrayer}
                    aria-invalid={Boolean(
                        state.errors?.openingPrayer,
                    )}
                    aria-describedby={
                        state.errors?.openingPrayer
                            ? "openingPrayer-error"
                            : undefined
                    }
                    className={inputStyles}
                />
                <FieldErrors
                    id="openingPrayer-error"
                    errors={state.errors?.openingPrayer}
                />
            </div>

            <div>
                <label
                    htmlFor="wardBusiness"
                    className="block font-medium text-slate-800"
                >
                    Ward business
                </label>
                <p className="text-sm text-slate-600">
                    Enter one item per line.
                </p>
                <textarea
                    id="wardBusiness"
                    name="wardBusiness"
                    rows={4}
                    defaultValue={meeting?.wardBusiness
                        ?.map((item) => item.description)
                        .join("\n")}
                    className={inputStyles}
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    id="stakeBusiness"
                    name="stakeBusiness"
                    type="checkbox"
                    defaultChecked={meeting?.stakeBusiness}
                    className="h-5 w-5"
                />
                <label
                    htmlFor="stakeBusiness"
                    className="font-medium text-slate-800"
                >
                    Includes stake business
                </label>
            </div>

            <fieldset className="rounded-lg border border-slate-200 p-4">
                <legend className="px-2 font-semibold text-slate-900">
                    Sacrament hymn
                </legend>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="sacramentHymnNumber"
                            className="block font-medium text-slate-800"
                        >
                            Hymn number
                        </label>
                        <input
                            id="sacramentHymnNumber"
                            name="sacramentHymnNumber"
                            type="number"
                            min="1"
                            required
                            defaultValue={
                                meeting?.sacramentHymn.number
                            }
                            aria-invalid={Boolean(
                                state.errors?.sacramentHymnNumber,
                            )}
                            aria-describedby={
                                state.errors?.sacramentHymnNumber
                                    ? "sacramentHymnNumber-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="sacramentHymnNumber-error"
                            errors={
                                state.errors?.sacramentHymnNumber
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="sacramentHymnTitle"
                            className="block font-medium text-slate-800"
                        >
                            Hymn title
                        </label>
                        <input
                            id="sacramentHymnTitle"
                            name="sacramentHymnTitle"
                            required
                            defaultValue={
                                meeting?.sacramentHymn.title
                            }
                            aria-invalid={Boolean(
                                state.errors?.sacramentHymnTitle,
                            )}
                            aria-describedby={
                                state.errors?.sacramentHymnTitle
                                    ? "sacramentHymnTitle-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="sacramentHymnTitle-error"
                            errors={
                                state.errors?.sacramentHymnTitle
                            }
                        />
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="speakers"
                    className="block font-medium text-slate-800"
                >
                    Speakers
                </label>
                <p className="text-sm text-slate-600">
                    Enter one speaker per line using: Name | Topic
                </p>
                <textarea
                    id="speakers"
                    name="speakers"
                    rows={5}
                    required
                    defaultValue={speakers}
                    aria-invalid={Boolean(state.errors?.speakers)}
                    aria-describedby={
                        state.errors?.speakers
                            ? "speakers-error"
                            : undefined
                    }
                    className={inputStyles}
                />
                <FieldErrors
                    id="speakers-error"
                    errors={state.errors?.speakers}
                />
            </div>

            <fieldset className="rounded-lg border border-slate-200 p-4">
                <legend className="px-2 font-semibold text-slate-900">
                    Closing hymn
                </legend>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="closingHymnNumber"
                            className="block font-medium text-slate-800"
                        >
                            Hymn number
                        </label>
                        <input
                            id="closingHymnNumber"
                            name="closingHymnNumber"
                            type="number"
                            min="1"
                            required
                            defaultValue={
                                meeting?.closingHymn.number
                            }
                            aria-invalid={Boolean(
                                state.errors?.closingHymnNumber,
                            )}
                            aria-describedby={
                                state.errors?.closingHymnNumber
                                    ? "closingHymnNumber-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="closingHymnNumber-error"
                            errors={
                                state.errors?.closingHymnNumber
                            }
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="closingHymnTitle"
                            className="block font-medium text-slate-800"
                        >
                            Hymn title
                        </label>
                        <input
                            id="closingHymnTitle"
                            name="closingHymnTitle"
                            required
                            defaultValue={
                                meeting?.closingHymn.title
                            }
                            aria-invalid={Boolean(
                                state.errors?.closingHymnTitle,
                            )}
                            aria-describedby={
                                state.errors?.closingHymnTitle
                                    ? "closingHymnTitle-error"
                                    : undefined
                            }
                            className={inputStyles}
                        />
                        <FieldErrors
                            id="closingHymnTitle-error"
                            errors={
                                state.errors?.closingHymnTitle
                            }
                        />
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    htmlFor="closingPrayer"
                    className="block font-medium text-slate-800"
                >
                    Closing prayer
                </label>
                <input
                    id="closingPrayer"
                    name="closingPrayer"
                    required
                    defaultValue={meeting?.closingPrayer}
                    aria-invalid={Boolean(
                        state.errors?.closingPrayer,
                    )}
                    aria-describedby={
                        state.errors?.closingPrayer
                            ? "closingPrayer-error"
                            : undefined
                    }
                    className={inputStyles}
                />
                <FieldErrors
                    id="closingPrayer-error"
                    errors={state.errors?.closingPrayer}
                />
            </div>

            {state.message && (
                <p
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg bg-red-50 p-4 text-red-800"
                >
                    {state.message}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <SubmitButton label={submitLabel} />

                <Link
                    href="/meetings"
                    className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}