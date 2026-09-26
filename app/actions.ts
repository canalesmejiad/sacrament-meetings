"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
    addMeeting,
    deleteMeeting as deleteMeetingFromDatabase,
    updateMeeting as updateMeetingInDatabase,
} from "@/lib/meetings-db";

export type MeetingFormState = {
    errors?: Record<string, string[] | undefined>;
    message?: string;
};

const MeetingFormSchema = z.object({
    date: z.string().min(1, "Please select a meeting date."),
    meetingType: z.enum([
        "testimony",
        "regular",
        "stake",
        "general",
        "special",
    ]),
    presiding: z
        .string()
        .trim()
        .min(1, "Please enter who is presiding."),
    conducting: z
        .string()
        .trim()
        .min(1, "Please enter who is conducting."),
    announcements: z.string().trim().optional(),
    openingHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid opening hymn number."),
    openingHymnTitle: z
        .string()
        .trim()
        .min(1, "Please enter the opening hymn title."),
    openingPrayer: z
        .string()
        .trim()
        .min(1, "Please enter who will give the opening prayer."),
    wardBusiness: z.string().trim().optional(),
    stakeBusiness: z.boolean(),
    sacramentHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid sacrament hymn number."),
    sacramentHymnTitle: z
        .string()
        .trim()
        .min(1, "Please enter the sacrament hymn title."),
    speakers: z
        .string()
        .trim()
        .min(1, "Please enter at least one speaker."),
    closingHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid closing hymn number."),
    closingHymnTitle: z
        .string()
        .trim()
        .min(1, "Please enter the closing hymn title."),
    closingPrayer: z
        .string()
        .trim()
        .min(1, "Please enter who will give the closing prayer."),
});

type ValidatedMeeting = z.infer<typeof MeetingFormSchema>;

function splitLines(value?: string) {
    const items = value
        ?.split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    return items?.length ? items : undefined;
}

function prepareMeetingData(data: ValidatedMeeting) {
    return {
        date: data.date,
        meetingType: data.meetingType,
        presiding: data.presiding,
        conducting: data.conducting,
        announcements: splitLines(data.announcements),
        openingHymn: {
            number: data.openingHymnNumber,
            title: data.openingHymnTitle,
        },
        openingPrayer: data.openingPrayer,
        wardBusiness: splitLines(data.wardBusiness)?.map(
            (description) => ({
                description,
            }),
        ),
        stakeBusiness: data.stakeBusiness,
        sacramentHymn: {
            number: data.sacramentHymnNumber,
            title: data.sacramentHymnTitle,
        },
        speakers: data.speakers
            .split("\n")
            .map((speaker) => {
                const [name, topic = ""] = speaker
                    .split("|")
                    .map((part) => part.trim());

                return {
                    name,
                    topic,
                    type: "speaker" as const,
                };
            })
            .filter((speaker) => speaker.name),
        closingHymn: {
            number: data.closingHymnNumber,
            title: data.closingHymnTitle,
        },
        closingPrayer: data.closingPrayer,
    };
}

function validateMeetingForm(formData: FormData) {
    return MeetingFormSchema.safeParse({
        date: formData.get("date"),
        meetingType: formData.get("meetingType"),
        presiding: formData.get("presiding"),
        conducting: formData.get("conducting"),
        announcements: formData.get("announcements") ?? "",
        openingHymnNumber: formData.get("openingHymnNumber"),
        openingHymnTitle: formData.get("openingHymnTitle"),
        openingPrayer: formData.get("openingPrayer"),
        wardBusiness: formData.get("wardBusiness") ?? "",
        stakeBusiness: formData.get("stakeBusiness") === "on",
        sacramentHymnNumber: formData.get(
            "sacramentHymnNumber",
        ),
        sacramentHymnTitle: formData.get(
            "sacramentHymnTitle",
        ),
        speakers: formData.get("speakers"),
        closingHymnNumber: formData.get("closingHymnNumber"),
        closingHymnTitle: formData.get("closingHymnTitle"),
        closingPrayer: formData.get("closingPrayer"),
    });
}

export async function createMeeting(
    previousState: MeetingFormState,
    formData: FormData,
): Promise<MeetingFormState> {
    void previousState;

    const validatedFields = validateMeetingForm(formData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message:
                "Please correct the highlighted fields and try again.",
        };
    }

    try {
        await addMeeting(prepareMeetingData(validatedFields.data));
    } catch (error) {
        console.error("Unable to create meeting:", error);

        return {
            message:
                "A database error occurred. The meeting could not be created.",
        };
    }

    revalidatePath("/meetings");
    redirect("/meetings");
}

export async function updateMeeting(
    id: number,
    previousState: MeetingFormState,
    formData: FormData,
): Promise<MeetingFormState> {
    void previousState;

    const validatedFields = validateMeetingForm(formData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message:
                "Please correct the highlighted fields and try again.",
        };
    }

    try {
        const meeting = await updateMeetingInDatabase(
            id,
            prepareMeetingData(validatedFields.data),
        );

        if (!meeting) {
            return {
                message: "The requested meeting could not be found.",
            };
        }
    } catch (error) {
        console.error("Unable to update meeting:", error);

        return {
            message:
                "A database error occurred. The meeting could not be updated.",
        };
    }

    revalidatePath("/meetings");
    revalidatePath(`/meetings/${id}`);
    redirect("/meetings");
}

export async function deleteMeeting(
    id: number,
    previousState: MeetingFormState,
    formData: FormData,
): Promise<MeetingFormState> {
    void previousState;
    void formData;

    try {
        const deleted = await deleteMeetingFromDatabase(id);

        if (!deleted) {
            return {
                message: "The requested meeting could not be found.",
            };
        }
    } catch (error) {
        console.error("Unable to delete meeting:", error);

        return {
            message:
                "A database error occurred. The meeting could not be deleted.",
        };
    }

    revalidatePath("/meetings");
    redirect("/meetings");
}