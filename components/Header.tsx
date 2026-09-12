import Link from "next/link";

export default function Header() {
    const currentDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
    }).format(new Date());

    return (
        <header className="bg-slate-900 text-white shadow-md">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight hover:text-sky-300"
                >
                    Sacrament Meeting Planner
                </Link>

                <p className="text-sm text-slate-300">{currentDate}</p>
            </div>
        </header>
    );
}