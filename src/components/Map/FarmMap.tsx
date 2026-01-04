import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plant } from '../../types';
import { format } from 'date-fns';

// Fix for default marker icon in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit bounds
const MapBoundsInfo: React.FC<{ plants: Plant[] }> = ({ plants }) => {
    const map = useMap();

    useEffect(() => {
        if (plants.length > 0) {
            const bounds = plants.map(p => [p.latitude, p.longitude] as [number, number]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [plants, map]);

    return null;
};

interface FarmMapProps {
    plants: Plant[];
}

const FarmMap: React.FC<FarmMapProps> = ({ plants }) => {
    const initialCenter: [number, number] = [20.0, 78.0]; // Default center (e.g. India)

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
            <MapContainer
                center={initialCenter}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBoundsInfo plants={plants} />

                {plants.map((plant) => (
                    <Marker
                        key={plant._id || Math.random()}
                        position={[plant.latitude, plant.longitude]}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <img
                                    src={plant.imageUrl}
                                    alt={plant.imageName}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                />
                                <h3 className="font-semibold text-gray-900 text-sm truncate">{plant.imageName}</h3>
                                <div className="text-xs text-gray-500 mt-1">
                                    <p>Lat: {plant.latitude.toFixed(5)}</p>
                                    <p>Lng: {plant.longitude.toFixed(5)}</p>
                                    <p className="mt-1">
                                        {plant.uploadedAt ? format(new Date(plant.uploadedAt), 'PPP p') : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FarmMap;
