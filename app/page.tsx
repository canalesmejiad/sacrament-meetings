import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-semibold uppercase tracking-widest text-sky-700">
            Plan with purpose
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Organize meaningful sacrament meetings
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            View meeting agendas, review hymns and speakers, and prepare
            printable programs for current and past Sundays.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/meetings"
              className="rounded-md bg-sky-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-800"
            >
              View all meetings
            </Link>

            <Link
              href="/meetings/current"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              View current meeting
            </Link>
          </div>
        </div>

        <Image
          src="/meeting-planner.svg"
          alt="Illustration of a church meetinghouse surrounded by hills"
          width={800}
          height={520}
          priority
          className="h-auto w-full rounded-3xl shadow-lg"
        />
      </section>

      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-center text-3xl font-bold text-slate-900"
        >
          Everything needed to prepare
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Meeting agendas",
              text: "Review announcements, prayers, hymns, speakers, and ward business.",
            },
            {
              title: "Easy navigation",
              text: "Move quickly between the meeting list and complete program details.",
            },
            {
              title: "Printable programs",
              text: "Open a meeting and print a clean program for leaders and members.",
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}