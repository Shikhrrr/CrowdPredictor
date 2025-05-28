import React, { useState, useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    Polyline
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to update map center
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    return null;
}

// Gradient color generator
const getColor = (intensity) => {
    if (intensity < 0.3) return "#00f"; // blue
    if (intensity < 0.5) return "#0f0"; // green
    if (intensity < 0.7) return "#ff0"; // yellow
    if (intensity < 0.9) return "#f90"; // orange
    return "#f00"; // red
};

// Render the polyline in segments with gradient
const GradientPolyline = ({ path }) => {
    if (path.length < 2) return null;

    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
        const start = path[i];
        const end = path[i + 1];
        const intensity = start.intensity || 0.5;
        segments.push(
            <Polyline
                key={i}
                positions={[
                    [start.lat, start.lng],
                    [end.lat, end.lng],
                ]}
                color={getColor(intensity)}
                weight={6}
                opacity={0.9}
            />
        );
    }
    return <>{segments}</>;
};

const Travel = () => {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [path, setPath] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const watchIdRef = useRef(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => {
                    console.error(err);
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }
        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/get-path", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source, destination }),
        });
        const data = await res.json();
        const rawPath = data.path || [];

        const formattedPath = rawPath.map((point) => ({
            lat: point.lat || point[0],
            lng: point.lng || point[1],
            intensity: point.intensity ?? 0.5, // default intensity
        }));

        setPath(formattedPath);
    };

    return (
        <div className="relative min-h-screen font-sans bg-white">
            {/* Orange background with curved bottom */}
            <div
                className="absolute top-0 left-0 w-full"
                style={{
                    zIndex: 0,
                    height: "55vh",
                    background: "linear-gradient(90deg, #ff9100 0%, #ff6d00 100%)",
                }}
            >
                <svg
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 w-full"
                    style={{ height: "120px" }}
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#fff"
                        d="M0,256 C480,320 960,160 1440,256 L1440,320 L0,320 Z"
                    />
                </svg>
            </div>
            <div className="relative z-10 p-8">
                <h1 className="text-5xl font-extrabold text-center mb-10 text-white drop-shadow-lg">
                    Travel
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto mb-8 flex flex-col gap-4 items-end sm:flex-row"
                >
                    <label className="flex flex-col font-medium text-slate-700 w-full">
                        Source:
                        <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                            className="w-full p-2 rounded-lg border border-slate-300 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </label>
                    <label className="flex flex-col font-medium text-slate-700 w-full">
                        Destination:
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                            className="w-full p-2 rounded-lg border border-slate-300 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-colors whitespace-nowrap w-full sm:w-auto"
                    >
                        Show Safest Route
                    </button>
                </form>
                <div className="h-[60vh] w-full max-w-3xl mx-auto transition-transform duration-500 ease-in-out hover:scale-120">
                    <MapContainer
                        center={userLocation || [28.6139, 77.209]}
                        zoom={13}
                        className="h-full w-full rounded-2xl shadow-md"
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {userLocation && <Marker position={userLocation} />}
                        {path.length > 0 && (
                            <>
                                <GradientPolyline path={path} />
                                <Marker position={[path[0].lat, path[0].lng]} />
                                <Marker position={[path[path.length - 1].lat, path[path.length - 1].lng]} />
                            </>
                        )}
                        <MapUpdater position={userLocation} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Travel;
