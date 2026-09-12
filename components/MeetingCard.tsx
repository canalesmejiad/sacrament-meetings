import Link from "next/link";

import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
    meeting: SacramentMeeting;
}

export default function MeetingCard({
    meeting,
}: MeetingCardProps) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(new Date(`${meeting.date}T12:00:00Z`));

    return (
        <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold capitalize text-sky-800">
                    {meeting.meetingType}
                </span>

                <span className="text-sm text-slate-500">
                    Meeting #{meeting.id}
                </span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
                {formattedDate}
            </h2>

            <dl className="mt-4 space-y-2 text-sm">
                <div>
                    <dt className="font-semibold text-slate-800">Presiding</dt>
                    <dd className="text-slate-600">{meeting.presiding}</dd>
                </div>

                <div>
                    <dt className="font-semibold text-slate-800">Conducting</dt>
                    <dd className="text-slate-600">{meeting.conducting}</dd>
                </div>
            </dl>

            <Link
                href={`/meetings/${meeting.id}`}
                className="mt-6 inline-flex w-fit rounded-md bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-sky-800"
            >
                View program
            </Link>
        </article>
    );
}