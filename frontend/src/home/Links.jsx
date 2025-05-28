import React from 'react'
import Card from './Card'

const cardData = [
    { name: "Home", href: "#", img: "" },
    { name: "Live Data", href: "#", img: "" },
    { name: "Travel", href: "#", img: "" },
    { name: "Future Hotspots", href: "#", img: "" },
    { name: "About your location", href: "#", img: "" },
    { name: "Nearby Services", href: "#", img: "" },
    { name: "For Emergency Personnel", href: "#", img: "" },
];

export default function Links() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start bg-gray-100">
            {/* Orange background with curved bottom */}
            <div className="absolute top-0 left-0 w-full h-[150vh] sm:h-[80vh] z-0 overflow-hidden">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#ff8800"
                        d="M0,160 C400,320 1040,0 1440,160 L1440,0 L0,0 Z"
                    />
                </svg>
            </div>
            <div className="relative z-10 w-full max-w-6xl px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {cardData.map((card, idx) => (
                        <div
                            key={idx}
                            className="transition-transform duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-2xl bg-white rounded-xl"
                        >
                            <Card {...card} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}