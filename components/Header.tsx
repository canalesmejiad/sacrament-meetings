import Link from "next/link";
import CurrentDate from "./CurrentDate";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:text-sky-300"
        >
          Sacrament Meeting Planner
        </Link>

        <p className="text-sm text-slate-300">
          <CurrentDate />
        </p>
      </div>
    </header>
  );
}