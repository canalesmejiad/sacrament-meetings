interface EditMeetingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditMeetingPage({
    params,
}: EditMeetingPageProps) {
    const { id } = await params;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h1 className="text-3xl font-bold text-slate-900">
                Edit meeting {id}
            </h1>

            <p className="mt-4 text-slate-600">
                The meeting editing form will be implemented in Week 04.
            </p>
        </div>
    );
}