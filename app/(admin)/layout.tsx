export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="space-y-8">
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <p className="font-semibold text-amber-900">
                    Meeting administration
                </p>
            </div>

            {children}
        </section>
    );
}