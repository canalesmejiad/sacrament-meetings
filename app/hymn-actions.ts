"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import {
    addHymn,
    updateHymn as updateHymnInDatabase,
    deleteHymn as deleteHymnFromDatabase,
} from "@/lib/hymns-db";

export type HymnFormState = {
    errors?: Record<string, string[] | undefined>;
    message?: string;
};

const HymnSchema = z.object({
    number: z.coerce
        .number()
        .int("Please enter a whole hymn number.")
        .min(1, "The hymn number must be between 1 and 999.")
        .max(999, "The hymn number must be between 1 and 999."),
    title: z
        .string()
        .trim()
        .min(1, "Please enter a hymn title.")
        .max(150, "The title must be 150 characters or fewer."),
});

async function requireAdmin() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }
}

function databaseError(error: unknown): HymnFormState {
    console.error("Unable to save hymn:", error);

    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
    ) {
        return {
            errors: {
                number: ["A hymn with this number already exists."],
            },
            message: "Please correct the highlighted field.",
        };
    }

    return {
        message: "The hymn could not be saved. Please try again.",
    };
}

export async function createHymn(
    previousState: HymnFormState,
    formData: FormData,
): Promise<HymnFormState> {
    await requireAdmin();
    void previousState;

    const result = HymnSchema.safeParse({
        number: formData.get("number"),
        title: formData.get("title"),
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
        };
    }

    try {
        await addHymn(result.data.number, result.data.title);
    } catch (error) {
        return databaseError(error);
    }

    revalidatePath("/hymns");
    redirect("/hymns?success=created");
}

export async function updateHymn(
    id: number,
    previousState: HymnFormState,
    formData: FormData,
): Promise<HymnFormState> {
    await requireAdmin();
    void previousState;

    if (!Number.isSafeInteger(id) || id < 1) {
        return { message: "The requested hymn could not be found." };
    }

    const result = HymnSchema.safeParse({
        number: formData.get("number"),
        title: formData.get("title"),
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            message: "Please correct the highlighted fields.",
        };
    }

    try {
        const hymn = await updateHymnInDatabase(
            id,
            result.data.number,
            result.data.title,
        );

        if (!hymn) {
            return { message: "The requested hymn could not be found." };
        }
    } catch (error) {
        return databaseError(error);
    }

    revalidatePath("/hymns");
    revalidatePath(`/hymns/${id}/edit`);
    redirect("/hymns?success=updated");
}

export async function deleteHymn(
    id: number,
    previousState: HymnFormState,
    formData: FormData,
): Promise<HymnFormState> {
    await requireAdmin();
    void previousState;
    void formData;

    if (!Number.isSafeInteger(id) || id < 1) {
        return { message: "The requested hymn could not be found." };
    }

    try {
        const deleted = await deleteHymnFromDatabase(id);

        if (!deleted) {
            return { message: "The requested hymn could not be found." };
        }
    } catch (error) {
        console.error("Unable to delete hymn:", error);

        return {
            message: "The hymn could not be deleted. Please try again.",
        };
    }

    revalidatePath("/hymns");
    redirect("/hymns?success=deleted");
}