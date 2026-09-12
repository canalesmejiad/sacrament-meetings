import type { SacramentMeeting } from "./types";

const meetings: SacramentMeeting[] = [
    {
        id: 1,
        date: "2026-04-05",
        meetingType: "testimony",
        presiding: "Bishop David Smith",
        conducting: "Brother James Wilson",
        announcements: ["Ward temple night is Friday at 6:00 PM."],
        openingHymn: {
            number: 2,
            title: "The Spirit of God",
        },
        openingPrayer: "Sister Maria Lopez",
        wardBusiness: [
            {
                description: "Brother Daniel Green was sustained as ward clerk.",
            },
        ],
        stakeBusiness: false,
        sacramentHymn: {
            number: 169,
            title: "As Now We Take the Sacrament",
        },
        speakers: [
            {
                name: "Ward Members",
                topic: "Fast and testimony meeting",
                type: "speaker",
            },
        ],
        closingHymn: {
            number: 152,
            title: "God Be with You Till We Meet Again",
        },
        closingPrayer: "Brother Robert Davis",
    },
    {
        id: 2,
        date: "2026-04-12",
        meetingType: "regular",
        presiding: "Bishop David Smith",
        conducting: "Brother Michael Brown",
        announcements: ["Youth activity is Wednesday at 7:00 PM."],
        openingHymn: {
            number: 85,
            title: "How Firm a Foundation",
        },
        openingPrayer: "Sister Emily Johnson",
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: {
            number: 196,
            title: "Jesus, Once of Humble Birth",
        },
        speakers: [
            {
                name: "Sister Sofia Martinez",
                topic: "Following Jesus Christ",
                type: "speaker",
            },
            {
                name: "Brother Daniel Johnson",
                topic: "Faith in the Savior",
                type: "speaker",
            },
        ],
        closingHymn: {
            number: 134,
            title: "I Believe in Christ",
        },
        closingPrayer: "Sister Hannah Wilson",
    },
    {
        id: 3,
        date: "2026-04-19",
        meetingType: "stake",
        presiding: "President Thomas Anderson",
        conducting: "Bishop David Smith",
        announcements: ["Stake conference begins next Saturday."],
        openingHymn: {
            number: 5,
            title: "High on the Mountain Top",
        },
        openingPrayer: "Brother Samuel Clark",
        wardBusiness: [],
        stakeBusiness: true,
        sacramentHymn: {
            number: 172,
            title: "In Humility, Our Savior",
        },
        speakers: [
            {
                name: "President Thomas Anderson",
                topic: "Strengthening Our Families",
                type: "speaker",
            },
            {
                name: "Stake Youth Choir",
                topic: "Come, Follow Me",
                type: "musical-number",
            },
        ],
        closingHymn: {
            number: 7,
            title: "Israel, Israel, God Is Calling",
        },
        closingPrayer: "Sister Olivia Taylor",
    },
    {
        id: 4,
        date: "2026-04-26",
        meetingType: "general",
        presiding: "Bishop David Smith",
        conducting: "Brother James Wilson",
        announcements: ["General conference messages are available online."],
        openingHymn: {
            number: 6,
            title: "Redeemer of Israel",
        },
        openingPrayer: "Brother Ethan Moore",
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: {
            number: 181,
            title: "Jesus of Nazareth, Savior and King",
        },
        speakers: [
            {
                name: "Elder Jeffrey Holland",
                topic: "Trusting in the Lord",
                type: "speaker",
            },
            {
                name: "Sister Camille Johnson",
                topic: "Finding Peace in Jesus Christ",
                type: "speaker",
            },
        ],
        closingHymn: {
            number: 89,
            title: "The Lord Is My Light",
        },
        closingPrayer: "Sister Emma Garcia",
    },
    {
        id: 5,
        date: "2026-05-03",
        meetingType: "testimony",
        presiding: "Bishop David Smith",
        conducting: "Brother Michael Brown",
        announcements: [
            "Ward service project is Saturday at 9:00 AM.",
            "Primary activity is Tuesday at 6:00 PM.",
        ],
        openingHymn: {
            number: 136,
            title: "I Know That My Redeemer Lives",
        },
        openingPrayer: "Sister Grace Thompson",
        wardBusiness: [
            {
                description: "Sister Emma Garcia was called as Primary secretary.",
            },
        ],
        stakeBusiness: false,
        sacramentHymn: {
            number: 193,
            title: "I Stand All Amazed",
        },
        speakers: [
            {
                name: "Ward Members",
                topic: "Fast and testimony meeting",
                type: "speaker",
            },
        ],
        closingHymn: {
            number: 301,
            title: "I Am a Child of God",
        },
        closingPrayer: "Brother Noah Martinez",
    },
];

export function getMeetings(
    date: string | null = null,
): SacramentMeeting[] {
    if (date) {
        return meetings.filter((meeting) => meeting.date === date);
    }

    return meetings;
}

export function getMeetingById(
    id: number,
): SacramentMeeting | null {
    return meetings.find((meeting) => meeting.id === id) ?? null;
}