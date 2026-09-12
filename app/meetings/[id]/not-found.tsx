import Link from "next/link";

export default function MeetingNotFound() {
    return (
        <section className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="font-semibold uppercase tracking-widest text-amber-700">
                Meeting unavailable
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
                Meeting not found
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
                The requested sacrament meeting does not exist or is no longer
                available.
            </p>

            <Link
                href="/meetings"
                className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-sky-800"
            >
                Return to all meetings
            </Link>
        </section>
    );
}