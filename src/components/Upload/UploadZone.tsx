import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToQueue } from '../../redux/slices/uploadSlice';
import { RootState } from '../../redux/store';
import { UploadItem } from '../../types';

const UploadZone: React.FC = () => {
    const dispatch = useDispatch();
    const { queue } = useSelector((state: RootState) => state.upload);

    // Prevent adding duplicates by name (if already in queue)
    const isDuplicate = (fileName: string) => {
        return queue.some(item => item.file.name === fileName);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newItems: UploadItem[] = acceptedFiles
            .filter(file => !isDuplicate(file.name))
            .map(file => ({
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl: URL.createObjectURL(file),
                status: 'idle',
                progress: 0,
            }));

        if (newItems.length > 0) {
            dispatch(addToQueue(newItems));
        }
    }, [dispatch, queue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        multiple: true
    });

    return (
        <div
            {...getRootProps()}
            className={`
                group relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ease-in-out
                ${isDragActive
                    ? 'border-farm-500 bg-farm-50 scale-[1.02] shadow-lg'
                    : 'border-gray-200 hover:border-farm-400 hover:bg-gray-50 hover:shadow-md bg-white'
                }
            `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4 relative z-10">
                <div className={`
                    p-4 rounded-full transition-colors duration-300
                    ${isDragActive ? 'bg-farm-100 text-farm-600' : 'bg-gray-100 text-gray-500 group-hover:bg-farm-100 group-hover:text-farm-600'}
                `}>
                    <UploadCloud size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                    <p className="text-xl font-semibold text-gray-800 transition-colors group-hover:text-farm-700">
                        {isDragActive ? 'Drop images here' : 'Drag & Drop Plant Images'}
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        or click to browse from your device
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <ImageIcon size={14} />
                    <span>JPG, PNG supported</span>
                </div>
            </div>
        </div>
    );
};

export default UploadZone;
