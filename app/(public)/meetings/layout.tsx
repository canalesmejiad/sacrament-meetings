import Link from "next/link";

export default function MeetingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="space-y-8">
            <nav
                aria-label="Meeting navigation"
                className="no-print flex flex-wrap gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4"
            >
                <Link
                    href="/meetings"
                    className="font-semibold text-sky-800 hover:underline"
                >
                    All meetings
                </Link>

                <span aria-hidden="true" className="text-sky-400">
                    |
                </span>

                <Link
                    href="/meetings/current"
                    className="font-semibold text-sky-800 hover:underline"
                >
                    Current Sunday
                </Link>
            </nav>

            {children}
        </div>
    );
}