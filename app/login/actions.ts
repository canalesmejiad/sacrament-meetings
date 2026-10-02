"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export async function authenticate(
    previousState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    void previousState;

    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid email or password.";
                default:
                    return "Something went wrong. Please try again.";
            }
        }

        throw error;
    }
}