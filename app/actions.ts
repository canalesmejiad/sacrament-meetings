"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import {
    addMeeting,
    deleteMeeting as deleteMeetingFromDatabase,
    updateMeeting as updateMeetingInDatabase,
} from "@/lib/meetings-db";

export type MeetingFormState = {
    errors?: Record<string, string[] | undefined>;
    message?: string;
};

async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }
}

function isSundayDate(value: string) {
    const date = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().startsWith(value) &&
        date.getUTCDay() === 0
    );
}

const requiredText = (label: string, maximumLength: number) =>
    z
        .string()
        .trim()
        .min(1, `Please enter ${label}.`)
        .max(
            maximumLength,
            `${label[0].toUpperCase()}${label.slice(1)} must be ${maximumLength} characters or fewer.`,
        );

const MeetingFormSchema = z.object({
    date: z
        .string()
        .min(1, "Please select a meeting date.")
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Please enter a valid meeting date.",
        )
        .refine(
            isSundayDate,
            "Sacrament meetings must be scheduled on a Sunday.",
        ),
    meetingType: z.enum([
        "testimony",
        "regular",
        "stake",
        "general",
        "special",
    ]),
    presiding: requiredText("who is presiding", 100),
    conducting: requiredText("who is conducting", 100),
    announcements: z
        .string()
        .trim()
        .max(2000, "Announcements must be 2000 characters or fewer.")
        .optional(),
    openingHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid opening hymn number.")
        .max(999, "The opening hymn number must be 999 or lower."),
    openingHymnTitle: requiredText("the opening hymn title", 150),
    openingPrayer: requiredText(
        "who will give the opening prayer",
        100,
    ),
    wardBusiness: z
        .string()
        .trim()
        .max(2000, "Ward business must be 2000 characters or fewer.")
        .optional(),
    stakeBusiness: z.boolean(),
    sacramentHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid sacrament hymn number.")
        .max(999, "The sacrament hymn number must be 999 or lower."),
    sacramentHymnTitle: requiredText(
        "the sacrament hymn title",
        150,
    ),
    speakers: z
        .string()
        .trim()
        .min(1, "Please enter at least one speaker.")
        .max(2000, "The speaker list must be 2000 characters or fewer.")
        .superRefine((value, context) => {
            value.split("\n").forEach((line, index) => {
                const parts = line.split("|").map((part) => part.trim());

                if (parts.length !== 2 || !parts[0] || !parts[1]) {
                    context.addIssue({
                        code: "custom",
                        message: `Speaker ${index + 1} must use the format Name | Topic.`,
                    });
                }
            });
        }),
    closingHymnNumber: z.coerce
        .number()
        .int()
        .positive("Please enter a valid closing hymn number.")
        .max(999, "The closing hymn number must be 999 or lower."),
    closingHymnTitle: requiredText("the closing hymn title", 150),
    closingPrayer: requiredText(
        "who will give the closing prayer",
        100,
    ),
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
    await requireAdmin();
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
    redirect("/meetings?success=created");
}

export async function updateMeeting(
    id: number,
    previousState: MeetingFormState,
    formData: FormData,
): Promise<MeetingFormState> {
    await requireAdmin();
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
    redirect("/meetings?success=updated");
}

export async function deleteMeeting(
    id: number,
    previousState: MeetingFormState,
    formData: FormData,
): Promise<MeetingFormState> {
    await requireAdmin();
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
    redirect("/meetings?success=deleted");
}
