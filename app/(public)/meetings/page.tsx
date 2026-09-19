import MeetingCard from "@/components/MeetingCard";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import {
  getMeetings,
  getMeetingsTotalPages,
} from "@/lib/meetings-db";

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
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

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <section aria-labelledby="meetings-heading">
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
          Select a Sunday to review its complete meeting program.
        </p>

        <Search placeholder="Search by date, type, leader, or speaker..." />
      </div>

      {meetings.length > 0 ? (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
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