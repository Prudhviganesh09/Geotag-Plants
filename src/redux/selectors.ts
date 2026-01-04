import { Plant } from '../types';

export const filterPlants = (plants: Plant[] | undefined, searchQuery: string, sortBy: string): Plant[] => {
    if (!plants) return [];

    let result = [...plants];

    // Filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(p => p.imageName.toLowerCase().includes(query));
    }

    // Sort
    if (sortBy) {
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
                case 'date_asc':
                    return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
                case 'lat_desc':
                    return b.latitude - a.latitude;
                case 'lng_desc':
                    return b.longitude - a.longitude;
                default:
                    return 0;
            }
        });
    }

    return result;
};
