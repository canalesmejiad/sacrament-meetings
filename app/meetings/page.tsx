"use client";

import { useEffect, useState } from "react";

import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

export default function MeetingsPage() {
  const [meetings, setMeetings] =
    useState<SacramentMeeting[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings");

        if (!response.ok) {
          throw new Error("Unable to load the meetings.");
        }

        const data =
          (await response.json()) as SacramentMeeting[];

        setMeetings(data);
      } catch {
        setError("The meetings could not be loaded.");
      }
    }

    void loadMeetings();
  }, []);

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800"
      >
        {error}
      </div>
    );
  }

  if (!meetings) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-sky-200 bg-sky-50 p-6 text-sky-900"
      >
        Loading sacrament meetings...
      </div>
    );
  }

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
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
}