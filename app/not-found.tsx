import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6">
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">
                    Error 404
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    Meeting not found
                </h1>

                <p className="mt-4 text-slate-600">
                    The requested meeting does not exist or may have
                    been deleted.
                </p>

                <Link
                    href="/meetings"
                    className="mt-6 inline-flex rounded-md bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-sky-800"
                >
                    Return to meetings
                </Link>
            </div>
        </main>
    );
}