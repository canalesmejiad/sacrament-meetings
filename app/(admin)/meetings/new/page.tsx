import { createMeeting } from "@/app/actions";
import MeetingForm from "@/components/MeetingForm";

export default function NewMeetingPage() {
    return (
        <main className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Create a meeting
                </h1>

                <p className="mt-2 mb-8 text-slate-600">
                    Enter the information for the sacrament meeting.
                </p>

                <MeetingForm
                    action={createMeeting}
                    submitLabel="Create meeting"
                />
            </div>
        </main>
    );
}