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
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Asymmetric curved background */}
            <div className="absolute inset-0 pointer-events-none">
                <svg
                    viewBox="0 0 1200 800"
                    className="absolute top-0 left-0 w-full h-3/5"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
                            <stop offset="30%" stopColor="#fdba74" stopOpacity="0.6" />
                            <stop offset="70%" stopColor="#fb923c" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,0 L1200,0 L1200,320 C900,380 700,420 500,360 C300,300 150,280 0,340 Z"
                        fill="url(#orangeGradient)"
                    />
                </svg>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Large floating circles */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 opacity-20 rounded-full animate-float-slow"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-orange-300 opacity-25 rounded-full animate-float-medium"></div>
                <div className="absolute top-60 left-1/3 w-16 h-16 bg-orange-400 opacity-30 rounded-full animate-float-fast"></div>
                
                {/* Small floating dots */}
                <div className="absolute top-32 right-1/3 w-8 h-8 bg-orange-500 opacity-40 rounded-full animate-float-reverse"></div>
                <div className="absolute top-80 left-1/4 w-6 h-6 bg-orange-600 opacity-35 rounded-full animate-float-slow"></div>
                <div className="absolute top-96 right-1/4 w-10 h-10 bg-orange-300 opacity-25 rounded-full animate-float-medium"></div>
                
                {/* Traffic-themed shapes */}
                <div className="absolute top-48 left-20 w-12 h-12 bg-orange-400 opacity-30 rotate-45 animate-float-fast"></div>
                <div className="absolute top-72 right-32 w-8 h-8 bg-orange-500 opacity-35 rounded animate-float-reverse"></div>
            </div>

            <div className="relative z-10 p-6 max-w-7xl mx-auto">
                {/* Clean header section */}
                <div className="text-center mb-12 pt-8">
                    <h1 className="text-4xl sm:text-5xl font-light text-gray-800 mb-4">
                        Future
                        <span className="font-medium text-orange-600 ml-3">Hotspots</span>
                    </h1>
                    <p className="text-gray-600 text-lg font-light max-w-md mx-auto">
                        Predict traffic patterns and congestion areas
                    </p>
                    <div className="mt-4 w-16 h-0.5 bg-orange-500 mx-auto"></div>
                </div>

                {/* Controls section */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 backdrop-blur-sm bg-white/90">
                        <div className="text-center space-y-4">
                            <label className="block text-gray-700 font-medium text-lg">
                                Prediction timeframe
                            </label>
                            
                            {/* Custom styled range input */}
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="10"
                                    max="120"
                                    step="10"
                                    value={futureTime}
                                    onChange={(e) => setFutureTime(e.target.value)}
                                    className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="text-2xl font-light text-orange-600">
                                    {futureTime} <span className="text-lg text-gray-500">minutes</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={fetchPredictions}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Generate Predictions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                )}

                {/* Map section */}
                {submitted && !loading && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/95">
                            <div className="h-[60vh] w-full rounded-lg overflow-hidden transition-transform duration-500 ease-out hover:scale-105">
                                <MapContainer
                                    center={[28.6139, 77.209]} // Default center: Delhi
                                    zoom={13}
                                    className="h-full w-full"
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
                                                color: "#ea580c",
                                                weight: 2,
                                                opacity: 0.8,
                                            }}
                                        />
                                    ))}
                                </MapContainer>
                            </div>
                            
                            {/* Map legend */}
                            {predictedHotspots.length > 0 && (
                                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-orange-500 opacity-40 rounded-full"></div>
                                        <span>Predicted hotspot areas</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* No results message */}
                {submitted && !loading && predictedHotspots.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            No hotspots predicted for the selected timeframe
                        </div>
                    </div>
                )}
            </div>

            {/* Custom styles for range slider and animations */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #f97316;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }
                
                .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #f97316;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }

                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                }

                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(8deg); }
                }

                @keyframes float-reverse {
                    0%, 100% { transform: translateY(-10px) rotate(0deg); }
                    50% { transform: translateY(0px) rotate(-5deg); }
                }

                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float-medium 4s ease-in-out infinite;
                    animation-delay: 1s;
                }

                .animate-float-fast {
                    animation: float-fast 3s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .animate-float-reverse {
                    animation: float-reverse 5s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    );
};

export default FutureHotspots;