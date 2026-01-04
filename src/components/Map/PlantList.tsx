import React from 'react';
import { Plant } from '../../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Image as ImageIcon } from 'lucide-react';

interface PlantListProps {
    plants: Plant[];
}

const PlantList: React.FC<PlantListProps> = ({ plants }) => {
    if (plants.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500">No plants recorded yet. Start by uploading images!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
                <div key={plant._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-12 relative h-48 bg-gray-100">
                        <img
                            src={plant.imageUrl}
                            alt={plant.imageName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 truncate" title={plant.imageName}>
                            <ImageIcon size={16} className="text-farm-500" />
                            {plant.imageName}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-gray-400 mt-0.5" />
                                <span>
                                    {plant.latitude.toFixed(6)}, {plant.longitude.toFixed(6)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>
                                    {plant.uploadedAt ? format(new Date(plant.uploadedAt), 'MMM d, yyyy') : 'Unknown Date'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlantList;
