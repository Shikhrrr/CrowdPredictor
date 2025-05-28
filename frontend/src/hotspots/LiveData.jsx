import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap, Circle, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    return null;
}

const Hotspot = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const watchIdRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Color based on severity
    const getSeverityColor = (level) => {
        switch (level) {
            case 3: return "#ff0000"; // red
            case 2: return "#ffa500"; // orange
            case 1: return "#ffff00"; // yellow
            default: return "#999999";
        }
    };

    // Fetch hotspots from server
    const fetchHotspots = async (lat, lng) => {
        try {
            const res = await fetch("/api/get-hotspots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lat, lng }),
            });
            const data = await res.json();
            setHotspots(data.hotspots || []);
        } catch (error) {
            console.error("Error fetching hotspots:", error);
        }
    };

    // Track location + setup polling
    useEffect(() => {
        if ("geolocation" in navigator) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    const location = [lat, lng];
                    setUserLocation(location);
                    fetchHotspots(lat, lng); // Fetch initially on position update

                    // Setup or refresh polling
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = setInterval(() => {
                        fetchHotspots(lat, lng);
                    }, 10000); // every 10 seconds
                },
                (err) => console.error("Location error:", err),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }

        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#fff" }}>
            <div
                style={{
                    height: "70vh",
                    background: "#ff8800",
                    borderBottomLeftRadius: "800px 40px",
                    borderBottomRightRadius: "800px 40px",
                }}
            >
                <h1 className="text-white text-4xl font-bold text-center pt-8">Live  Tracker</h1>
                <p className="text-white text-center text-lg">
                    Updates every 10 seconds based on your location
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "-50vh",
                    zIndex: 0,
                }}
                className="h-[60vh] w-full max-w-3xl mx-auto transition-transform duration-500 ease-in-out hover:scale-120"
            >
                <MapContainer
                    center={userLocation || [28.6139, 77.2090]}
                    zoom={14}
                    className="h-full w-full rounded-2xl shadow-md"
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater position={userLocation} />
                    {userLocation && (
                        <Marker position={userLocation}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}
                    {hotspots.map((spot, idx) => (
                        <Circle
                            key={idx}
                            center={[spot.lat, spot.lng]}
                            radius={spot.radius || 200}
                            pathOptions={{
                                color: getSeverityColor(spot.severity),
                                fillColor: getSeverityColor(spot.severity),
                                fillOpacity: 0.5,
                            }}
                        >
                            <Popup>
                                <strong>{spot.name || "Hotspot"}</strong><br />
                                Severity: {spot.severity || "N/A"}
                            </Popup>
                        </Circle>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default Hotspot;
