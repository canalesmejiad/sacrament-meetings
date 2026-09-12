import { redirect } from "next/navigation";

import { getMeetings } from "@/lib/meetings-db";

export default function CurrentMeetingPage() {
    const today = new Date();
    const currentSunday = new Date(today);

    currentSunday.setDate(today.getDate() - today.getDay());

    const sundayDate = currentSunday.toISOString().split("T")[0];
    const currentMeeting = getMeetings(sundayDate)[0];

    if (!currentMeeting) {
        redirect("/meetings");
    }

    redirect(`/meetings/${currentMeeting.id}`);
}