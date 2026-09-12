"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home" },
    { href: "/meetings", label: "Meetings" },
    { href: "/meetings/current", label: "Current Meeting" },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main navigation"
            className="border-b border-slate-200 bg-white"
        >
            <ul className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 py-3">
                {links.map((link) => {
                    const isActive =
                        link.href === "/"
                            ? pathname === "/"
                            : pathname === link.href ||
                            pathname.startsWith(`${link.href}/`);

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`block rounded-md px-4 py-2 font-medium transition ${isActive
                                        ? "bg-sky-700 text-white"
                                        : "text-slate-700 hover:bg-sky-100 hover:text-sky-900"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}