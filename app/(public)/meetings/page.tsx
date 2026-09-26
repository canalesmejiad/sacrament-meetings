import Link from "next/link";

import MeetingCard from "@/components/MeetingCard";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import {
  getMeetings,
  getMeetingsTotalPages,
} from "@/lib/meetings-db";

const successMessages = {
  created: "The meeting was created successfully.",
  updated: "The meeting was updated successfully.",
  deleted: "The meeting was deleted successfully.",
} as const;

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    success?: string;
  }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;

  const query =
    typeof params.query === "string" ? params.query : "";

  const requestedPage = Number(params.page);
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const successMessage =
    typeof params.success === "string"
      ? successMessages[
      params.success as keyof typeof successMessages
      ]
      : undefined;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <section aria-labelledby="meetings-heading">
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
        >
          <p className="font-medium">{successMessage}</p>

          <Link
            href="/meetings"
            className="font-semibold underline hover:no-underline"
          >
            Dismiss
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-widest text-sky-700">
            Meeting archive
          </p>

          <h1
            id="meetings-heading"
            className="mt-2 text-4xl font-bold tracking-tight text-slate-900"
          >
            Sacrament meetings
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Select a Sunday to review its complete
            meeting program.
          </p>
        </div>

        <Link
          href="/meetings/new"
          className="inline-flex w-fit rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
        >
          Create meeting
        </Link>
      </div>

      <div className="max-w-2xl">
        <Search placeholder="Search by date, type, leader, or speaker..." />
      </div>

      {meetings.length > 0 ? (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      ) : (
        <p
          role="status"
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-slate-700"
        >
          No meetings matched your search.
        </p>
      )}
    </section>
  );
}