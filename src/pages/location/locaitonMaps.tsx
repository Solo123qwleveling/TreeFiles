import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  onSelectLocation?: (lat: number, lng: number) => void;
}

export default function LocationMap({ onSelectLocation }: LocationMapProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        onSelectLocation?.(lat, lng);
      },
    });
    return null;
  }

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setMarker({ lat: latitude, lng: longitude });
      onSelectLocation?.(latitude, longitude);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search location..."
          className="w-full px-4 py-2 border rounded-xl shadow"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">✕</button>
      </div>

      <button
        onClick={requestLocation}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Request My Location
      </button>

      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow">
        <MapContainer
          center={[41.015137, 28.97953]}
          zoom={12}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapClickHandler />

          {marker && <Marker position={[marker.lat, marker.lng]} />}
        </MapContainer>
      </div>
    </div>
  );
}
