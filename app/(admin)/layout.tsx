import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-4">
                <div>
                    <p className="font-semibold text-amber-900">
                        Meeting administration
                    </p>

                    <p className="text-sm text-amber-800">
                        Signed in as {session.user.email}
                    </p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/login" });
                    }}
                >
                    <button
                        type="submit"
                        className="rounded-lg border border-amber-700 px-3 py-2 font-semibold text-amber-900"
                    >
                        Sign out
                    </button>
                </form>
            </div>

            {children}
        </section>
    );
}