import React, { useState } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FutureHotspots = () => {
    const [futureTime, setFutureTime] = useState(30); // in minutes
    const [predictedHotspots, setPredictedHotspots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fetchPredictions = async () => {
        setLoading(true);
        setSubmitted(true);
        try {
            const res = await fetch(`/api/predict-hotspots?minutes=${futureTime}`);
            const data = await res.json();
            setPredictedHotspots(data);
        } catch {
            setPredictedHotspots([]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-0 bg-white relative overflow-hidden">
            {/* Smooth orange wave background */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-orange-500 z-0" />
            <svg
                className="absolute top-0 left-0 w-full h-32 z-0"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <path
                    fill="#f97316"
                    d="M0,160 C360,240 1080,80 1440,160 L1440,0 L0,0 Z"
                />
            </svg>

            <div className="relative z-10 p-6">
                <svg
                    className="absolute top-0 left-0 w-full h-32 z-0"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#f97316"
                        d="M0,160 C360,240 1080,80 1440,160 L1440,0 L0,0 Z"
                    />
                </svg>

                <div className="flex flex-col items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-center text-orange-600 mb-6" style={{zIndex: 10, color: "white"}}>
                        Predicted Future Hotspots
                    </h1>
                    <label className="text-slate-700 font-medium text-lg">
                        Predict for how many minutes from now?
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="120"
                        step="10"
                        value={futureTime}
                        onChange={(e) => setFutureTime(e.target.value)}
                        className="w-64"
                    />
                    <span className="text-lg font-semibold text-blue-700">
                        {futureTime} minutes
                    </span>
                    <button
                        onClick={fetchPredictions}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                    >
                        Show Predictions
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                ) : submitted && (
                    <div className="h-[60vh] max-w-3xl mx-auto transition-transform duration-500 ease-in-out hover:scale-108">
                        <MapContainer
                            center={[28.6139, 77.209]} // Default center: Delhi
                            zoom={13}
                            className="h-full w-full rounded-xl"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            {predictedHotspots.map((spot, idx) => (
                                <Circle
                                    key={idx}
                                    center={[spot.latitude, spot.longitude]}
                                    radius={300}
                                    pathOptions={{
                                        fillColor: "#f97316",
                                        fillOpacity: 0.4,
                                        stroke: false,
                                    }}
                                />
                            ))}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FutureHotspots;
