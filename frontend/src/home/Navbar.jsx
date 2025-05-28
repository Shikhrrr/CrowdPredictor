import React, { useState } from "react";

const navLinks = [
    { name: "Home", link: "#" },
    { name: "Travel", link: "#" },
    { name: "Hotspots", link: "#" },
    { name: "Future Hotspots", link: "#"},
    { name: "About your location", link: "#" },
    { name: "Nearby Services", link: "#" },
    { name: "Live Data", link: "#" },
    { name: "For Emergency Personnel", link: "#" },
];

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#FE5D26] text-white px-6 py-4 shadow-md z-40">
                <div className="text-2xl font-bold">HackZilla</div>
                <button
                    className="md:hidden text-3xl focus:outline-none"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle navigation"
                >
                    <span>&#9776;</span>
                </button>
                <ul className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.link}
                                className="hover:text-blue-300 transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden`}
            >
                <button
                    className="absolute top-4 right-4 text-3xl text-gray-700 focus:outline-none"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                >
                    &times;
                </button>
                <ul className="mt-16 space-y-4 px-6">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.link}
                                className="block text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200"
                                onClick={() => setSidebarOpen(false)}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300 ${
                    sidebarOpen ? "block opacity-100" : "hidden opacity-0"
                } md:hidden`}
                onClick={() => setSidebarOpen(false)}
            />
            {/* Spacer to prevent content from being hidden behind navbar */}
            <div className="h-20 md:h-20" />
        </>
    );
};

export default Navbar;