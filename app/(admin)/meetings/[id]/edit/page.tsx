import { notFound } from "next/navigation";

import { updateMeeting } from "@/app/actions";
import MeetingForm from "@/components/MeetingForm";
import { getMeetingById } from "@/lib/meetings-db";

interface EditMeetingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditMeetingPage({
    params,
}: EditMeetingPageProps) {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId < 1) {
        notFound();
    }

    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
        notFound();
    }

    const updateMeetingWithId = updateMeeting.bind(
        null,
        meeting.id,
    );

    return (
        <main className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Edit meeting
                </h1>

                <p className="mt-2 mb-8 text-slate-600">
                    Update the information for this sacrament
                    meeting.
                </p>

                <MeetingForm
                    action={updateMeetingWithId}
                    meeting={meeting}
                    submitLabel="Save changes"
                />
            </div>
        </main>
    );
}