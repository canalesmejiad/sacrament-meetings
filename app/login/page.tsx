import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <main className="mx-auto max-w-md space-y-6 rounded-xl border p-6">
            <div>
                <h1 className="text-2xl font-bold">Bishopric Login</h1>
                <p className="text-gray-600">
                    Sign in to manage sacrament meetings.
                </p>
            </div>

            <form
                action={async (formData) => {
                    "use server";
                    await signIn("credentials", formData);
                }}
                className="space-y-4"
            >
                <input
                    type="hidden"
                    name="redirectTo"
                    value="/meetings/new"
                />

                <div className="space-y-1">
                    <label htmlFor="email" className="block font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="block font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white"
                >
                    Sign in
                </button>
            </form>
        </main>
    );
}