"use client";

import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

interface SearchProps {
    placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", "1");

        if (term.trim()) {
            params.set("query", term);
        } else {
            params.delete("query");
        }

        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative mt-8 max-w-xl">
            <label
                htmlFor="meeting-search"
                className="mb-2 block font-semibold text-slate-800"
            >
                Search meetings
            </label>

            <input
                id="meeting-search"
                type="search"
                placeholder={placeholder}
                defaultValue={searchParams.get("query") ?? ""}
                onChange={(event) => handleSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
        </div>
    );
}