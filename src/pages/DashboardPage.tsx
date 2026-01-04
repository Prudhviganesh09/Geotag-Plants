import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setViewMode, setSearchQuery, setSortBy } from '../redux/slices/uiSlice';
import { useGetPlantsQuery } from '../services/plantApi';
import { filterPlants } from '../redux/selectors';
import UploadZone from '../components/Upload/UploadZone';
import UploadList from '../components/Upload/UploadList';
import FarmMap from '../components/Map/FarmMap';
import PlantList from '../components/Map/PlantList';
import { useUploadProcessor } from '../hooks/useUploadProcessor';
import { Sprout, Map as MapIcon, List, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';

const DashboardPage: React.FC = () => {
    // Initialize background processing
    useUploadProcessor();

    const dispatch = useDispatch();
    const { emailId } = useSelector((state: RootState) => state.user);
    const { viewMode, searchQuery, sortBy } = useSelector((state: RootState) => state.ui);

    // Fetch plants (poll every 30s or on invalidation)
    const { data: plants, isLoading, isError } = useGetPlantsQuery(emailId || '', {
        skip: !emailId,
        pollingInterval: 30000,
    });

    const displayPlants = useMemo(() => {
        return filterPlants(plants, searchQuery, sortBy);
    }, [plants, searchQuery, sortBy]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Left Panel: Upload & List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sprout size={20} className="text-farm-600" />
                        Add New Plants
                    </h2>
                    <UploadZone />
                    <UploadList />
                </div>
            </div>

            {/* Right Panel: Map/List Visualization */}
            <div className="lg:col-span-2 space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search plants..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-farm-500"
                                value={searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mr-2">
                            <Filter size={16} />
                            <select
                                className="bg-transparent border-none focus:ring-0 cursor-pointer"
                                value={sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value))}
                            >
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
                                <option value="lat_desc">Latitude: High to Low</option>
                                <option value="lng_desc">Longitude: High to Low</option>
                            </select>
                        </div>

                        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => dispatch(setViewMode('map'))}
                                className={clsx(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'map' ? "bg-white shadow text-farm-600" : "text-gray-500 hover:text-gray-700"
                                )}
                                title="Map View"
                            >
                                <MapIcon size={20} />
                            </button>
                            <button
                                onClick={() => dispatch(setViewMode('list'))}
                                className={clsx(
                                    "p-2 rounded-md transition-all",
                                    viewMode === 'list' ? "bg-white shadow text-farm-600" : "text-gray-500 hover:text-gray-700"
                                )}
                                title="List View"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100">
                        Loading plants...
                    </div>
                ) : isError ? (
                    <div className="h-64 flex items-center justify-center text-red-400 bg-white rounded-xl border border-gray-100">
                        Failed to load plant data.
                    </div>
                ) : (
                    <>
                        {viewMode === 'map' ? (
                            <FarmMap plants={displayPlants} />
                        ) : (
                            <PlantList plants={displayPlants} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
