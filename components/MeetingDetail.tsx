"use client";

import MeetingActions from "@/components/MeetingActions";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
    meeting: SacramentMeeting;
}

export default function MeetingDetail({
    meeting,
}: MeetingDetailProps) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeZone: "UTC",
    }).format(new Date(`${meeting.date}T12:00:00Z`));

    return (
        <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <header className="border-b border-slate-200 pb-6 text-center">
                <p className="font-semibold uppercase tracking-widest text-sky-700">
                    {meeting.meetingType} meeting
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Sacrament Meeting Program
                </h1>

                <p className="mt-2 text-slate-600">
                    {formattedDate}
                </p>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print mt-5 rounded-md bg-sky-700 px-5 py-2 font-semibold text-white hover:bg-sky-800"
                >
                    Print program
                </button>
            </header>

            <MeetingActions meetingId={meeting.id} />

            <section
                aria-labelledby="leadership-heading"
                className="py-6"
            >
                <h2
                    id="leadership-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Leadership
                </h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt className="font-semibold">
                            Presiding
                        </dt>
                        <dd className="text-slate-600">
                            {meeting.presiding}
                        </dd>
                    </div>

                    <div>
                        <dt className="font-semibold">
                            Conducting
                        </dt>
                        <dd className="text-slate-600">
                            {meeting.conducting}
                        </dd>
                    </div>
                </dl>
            </section>

            <section
                aria-labelledby="announcements-heading"
                className="border-t border-slate-200 py-6"
            >
                <h2
                    id="announcements-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Announcements
                </h2>

                {meeting.announcements?.length ? (
                    <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                        {meeting.announcements.map(
                            (announcement) => (
                                <li key={announcement}>
                                    {announcement}
                                </li>
                            ),
                        )}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No announcements.
                    </p>
                )}
            </section>

            <section
                aria-labelledby="program-heading"
                className="border-t border-slate-200 py-6"
            >
                <h2
                    id="program-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Meeting Program
                </h2>

                <dl className="mt-4 space-y-4">
                    <div>
                        <dt className="font-semibold">
                            Opening Hymn
                        </dt>
                        <dd className="text-slate-600">
                            #{meeting.openingHymn.number} —{" "}
                            {meeting.openingHymn.title}
                        </dd>
                    </div>

                    <div>
                        <dt className="font-semibold">
                            Opening Prayer
                        </dt>
                        <dd className="text-slate-600">
                            {meeting.openingPrayer}
                        </dd>
                    </div>

                    <div>
                        <dt className="font-semibold">
                            Sacrament Hymn
                        </dt>
                        <dd className="text-slate-600">
                            #{meeting.sacramentHymn.number} —{" "}
                            {meeting.sacramentHymn.title}
                        </dd>
                    </div>
                </dl>
            </section>

            <section
                aria-labelledby="business-heading"
                className="border-t border-slate-200 py-6"
            >
                <h2
                    id="business-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Church Business
                </h2>

                <p className="mt-3 text-slate-600">
                    <strong>Stake business:</strong>{" "}
                    {meeting.stakeBusiness ? "Yes" : "No"}
                </p>

                {meeting.wardBusiness?.length ? (
                    <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
                        {meeting.wardBusiness.map((item) => (
                            <li key={item.description}>
                                {item.description}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No ward business.
                    </p>
                )}
            </section>

            <section
                aria-labelledby="speakers-heading"
                className="border-t border-slate-200 py-6"
            >
                <h2
                    id="speakers-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Speakers and Musical Numbers
                </h2>

                <ol className="mt-4 space-y-4">
                    {meeting.speakers.map((speaker, index) => (
                        <li
                            key={`${speaker.name}-${index}`}
                            className="rounded-lg bg-slate-50 p-4"
                        >
                            <p className="font-semibold text-slate-900">
                                {speaker.name}
                            </p>

                            <p className="text-slate-600">
                                {speaker.topic}
                            </p>

                            <p className="mt-1 text-sm capitalize text-sky-700">
                                {speaker.type.replace("-", " ")}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            <section
                aria-labelledby="closing-heading"
                className="border-t border-slate-200 pt-6"
            >
                <h2
                    id="closing-heading"
                    className="text-xl font-bold text-slate-900"
                >
                    Closing
                </h2>

                <dl className="mt-4 space-y-4">
                    <div>
                        <dt className="font-semibold">
                            Closing Hymn
                        </dt>
                        <dd className="text-slate-600">
                            #{meeting.closingHymn.number} —{" "}
                            {meeting.closingHymn.title}
                        </dd>
                    </div>

                    <div>
                        <dt className="font-semibold">
                            Closing Prayer
                        </dt>
                        <dd className="text-slate-600">
                            {meeting.closingPrayer}
                        </dd>
                    </div>
                </dl>
            </section>
        </article>
    );
}