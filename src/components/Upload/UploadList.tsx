import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Check, AlertCircle, Loader2, MapPin } from 'lucide-react';

const UploadList: React.FC = () => {
    const { queue } = useSelector((state: RootState) => state.upload);

    if (queue.length === 0) return null;

    return (
        <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Upload Queue ({queue.length})
            </h3>
            {queue.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-4 shadow-sm">
                    <img src={item.previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md" />

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={item.file.name}>
                            {item.file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            {/* Progress Bar */}
                            {item.status === 'uploading' && (
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-farm-500 transition-all duration-300"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            )}

                            {/* Status Text/Icon */}
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                {item.status === 'uploading' && 'Uploading...'}
                                {item.status === 'uploaded' && 'Processing...'}
                                {item.status === 'gpsProcessing' && (
                                    <span className="text-blue-600 flex items-center gap-1">
                                        <Loader2 size={12} className="animate-spin" /> Extracting GPS
                                    </span>
                                )}
                                {item.status === 'saved' && (
                                    <span className="text-farm-600 flex items-center gap-1 font-medium">
                                        <Check size={14} /> Saved
                                    </span>
                                )}
                                {item.status === 'error' && (
                                    <span className="text-red-500 flex items-center gap-1 font-medium">
                                        <AlertCircle size={14} /> {item.error || 'Failed'}
                                    </span>
                                )}
                            </span>
                        </div>
                        {item.lat && (
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={10} /> {item.lat.toFixed(4)}, {item.lng?.toFixed(4)}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UploadList;
