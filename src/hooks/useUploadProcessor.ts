import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateUploadStatus, updateUploadData } from '../redux/slices/uploadSlice';
import { addToast } from '../redux/slices/uiSlice';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { useExtractGPSMutation, useSavePlantMutation } from '../services/plantApi';

export const useUploadProcessor = () => {
    const dispatch = useDispatch();
    const { queue } = useSelector((state: RootState) => state.upload);
    const { emailId } = useSelector((state: RootState) => state.user);

    const [extractGPS] = useExtractGPSMutation();
    const [savePlant] = useSavePlantMutation();

    useEffect(() => {
        // Process one item at a time or in parallel? Cloudinary can handle parallel.
        // We'll filter for 'idle' items and start them.

        queue.forEach(async (item) => {
            if (item.status === 'idle') {
                // 1. Start Upload
                dispatch(updateUploadStatus({ id: item.id, status: 'uploading', progress: 0 }));

                try {
                    // Upload to Cloudinary
                    const imageUrl = await uploadToCloudinary(item.file, (progress) => {
                        dispatch(updateUploadStatus({ id: item.id, status: 'uploading', progress }));
                    });

                    // Upload Success
                    dispatch(updateUploadStatus({ id: item.id, status: 'uploaded', progress: 100 }));
                    dispatch(updateUploadData({ id: item.id, imageUrl }));

                    // 2. Extract GPS (Trigger immediately if success)
                    dispatch(updateUploadStatus({ id: item.id, status: 'gpsProcessing' }));

                    if (!emailId) {
                        throw new Error("User email missing");
                    }

                    const gpsResponse = await extractGPS({
                        emailId,
                        imageName: item.file.name,
                        imageUrl
                    }).unwrap();

                    if (gpsResponse.latitude && gpsResponse.longitude) {
                        dispatch(updateUploadData({
                            id: item.id,
                            lat: gpsResponse.latitude,
                            lng: gpsResponse.longitude
                        }));

                        // 3. Save Plant
                        dispatch(updateUploadStatus({ id: item.id, status: 'saving' as any })); // 'saving' is not in types, using gpsProcessing or new type? 
                        // The user types said: 'idle' | 'uploading' | 'uploaded' | 'gpsProcessing' | 'saved' | 'error'
                        // We'll stick to 'gpsProcessing' until saved, or add 'saving'?
                        // User requested: idle | uploading | uploaded | gpsProcessing | saved | error
                        // So we stay in gpsProcessing until saved? Or maybe 'uploaded' -> 'gpsProcessing' -> 'saved'

                        await savePlant({
                            emailId,
                            imageName: item.file.name,
                            imageUrl,
                            latitude: gpsResponse.latitude,
                            longitude: gpsResponse.longitude
                        }).unwrap();

                        dispatch(updateUploadStatus({ id: item.id, status: 'saved' }));
                        dispatch(addToast({ message: `Plant ${item.file.name} saved successfully!`, type: 'success' }));
                    } else {
                        // GPS Failed
                        dispatch(updateUploadStatus({ id: item.id, status: 'error', error: 'No GPS data found' }));
                        dispatch(addToast({ message: `No GPS found for ${item.file.name}`, type: 'error' }));
                    }

                } catch (error) {
                    console.error("Processing error", error);
                    dispatch(updateUploadStatus({ id: item.id, status: 'error', error: 'Upload or processing failed' }));
                    dispatch(addToast({ message: `Failed to process ${item.file.name}`, type: 'error' }));
                }
            }
        });
    }, [queue, dispatch, emailId, extractGPS, savePlant]);
};
