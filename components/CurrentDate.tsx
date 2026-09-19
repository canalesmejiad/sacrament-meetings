"use client";

import { useEffect, useState } from "react";

function formatCurrentDate() {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
    }).format(new Date());
}

export default function CurrentDate() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            setCurrentDate(formatCurrentDate());
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

    return <span>{currentDate}</span>;
}