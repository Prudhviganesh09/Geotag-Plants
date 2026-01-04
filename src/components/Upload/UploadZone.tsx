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
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-farm-500 bg-farm-50' : 'border-gray-300 hover:border-farm-400 bg-gray-50'}`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-full ${isDragActive ? 'bg-farm-100 text-farm-600' : 'bg-gray-200 text-gray-500'}`}>
                    <UploadCloud size={32} />
                </div>
                <div>
                    <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? 'Drop images here' : 'Drag & Drop Plant Images'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        or click to browse from your device
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <ImageIcon size={14} />
                    <span>JPG, PNG supported</span>
                </div>
            </div>
        </div>
    );
};

export default UploadZone;
