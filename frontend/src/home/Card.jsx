import React from "react";

const Card = ({ name, href, img }) => {
    const handleClick = () => {
        const section = document.getElementById(href);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center items-center p-6 w-80 m-4"
            onClick={handleClick}
        >
            <img
                src={img}
                alt={name}
                className="w-16 h-16 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 text-center">{name}</h3>
        </div>
    );
};

export default Card;