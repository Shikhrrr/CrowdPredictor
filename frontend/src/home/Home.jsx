import { useState, useEffect, useRef } from "react";
import travelImg1 from "../assets/img/home/travelImg1.png";
import travelImg2 from "../assets/img/home/travelImg2.png";
import travelImg3 from "../assets/img/home/travelImg3.png";
import travelImg4 from "../assets/img/home/travelImg4.png";

const images = [travelImg1, travelImg2, travelImg3, travelImg4];

const Home = () => {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearTimeout(timeoutRef.current);
    }, [current]);

    const prevImage = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextImage = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden relative bg-white">
            {/* Left Section (hidden on mobile, visible on md+) */}
            <div className="hidden md:flex w-1/2 h-full flex-col justify-center items-center pr-16 z-10 transition-transform duration-500 ease-in-out hover:scale-105">
                <div className="max-w-md text-center">
                    <h1 className="text-[100px] font-bold mb-6 text-gray-900">Travel safely</h1>
                    <p className="text-2xl text-gray-600 mb-2">
                        Discover new destinations with peace of mind. Our platform ensures your journeys are secure and comfortable.
                    </p>
                    <p className="text-2xl text-gray-600 mb-2">
                        Plan ahead, stay informed, and enjoy seamless travel experiences every time.
                    </p>
                    <p className="text-2xl text-gray-600">
                        Your safety is our top priority—explore the world with confidence.
                    </p>
                </div>
            </div>

            {/* Right Section with Slideshow */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-end z-10 relative overflow-hidden transition-transform duration-500 ease-in-out hover:scale-105">
                <img
                    src={images[current]}
                    alt="Travel"
                    className="w-full h-full object-cover shadow-xl transition-all duration-700 [clip-path:ellipse(90%_100%_at_15%_50%)] md:[clip-path:ellipse(90%_100%_at_100%_15%)] [clip-path:none]:sm"
                />
                {/* Mobile Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:hidden bg-gradient-to-b from-black/60 via-black/30 to-transparent z-20">
                    <h1 className="text-4xl xs:text-5xl font-extrabold mb-4 text-white text-center drop-shadow-lg">Travel safely</h1>
                    <p className="text-lg xs:text-xl font-bold text-white mb-2 text-center drop-shadow">
                        Discover new destinations with peace of mind. Our platform ensures your journeys are secure and comfortable.
                    </p>
                    <p className="text-lg xs:text-xl font-bold text-white mb-2 text-center drop-shadow">
                        Plan ahead, stay informed, and enjoy seamless travel experiences every time.
                    </p>
                    <p className="text-lg xs:text-xl font-bold text-white text-center drop-shadow">
                        Your safety is our top priority—explore the world with confidence.
                    </p>
                </div>
                {/* Arrows */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 z-30">
                    <button
                        onClick={prevImage}
                        className="bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-300"
                        aria-label="Previous image"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={nextImage}
                        className="bg-white/80 hover:bg-white rounded-full p-2 shadow border border-gray-300"
                        aria-label="Next image"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
