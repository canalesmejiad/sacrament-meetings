"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({
    currentPage,
    totalPages,
}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function createPageURL(pageNumber: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());

        return `${pathname}?${params.toString()}`;
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Meeting pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
            {currentPage > 1 ? (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Previous
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400"
                >
                    Previous
                </span>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                    <Link
                        key={pageNumber}
                        href={createPageURL(pageNumber)}
                        aria-current={isCurrentPage ? "page" : undefined}
                        className={
                            isCurrentPage
                                ? "rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white"
                                : "rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                        }
                    >
                        {pageNumber}
                    </Link>
                );
            })}

            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Next
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400"
                >
                    Next
                </span>
            )}
        </nav>
    );
}