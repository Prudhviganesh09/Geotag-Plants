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

                    let latitude = 0;
                    let longitude = 0;

                    try {
                        const gpsResponse = await extractGPS({
                            emailId,
                            imageName: item.file.name,
                            imageUrl
                        }).unwrap();

                        if (gpsResponse.latitude && gpsResponse.longitude) {
                            latitude = gpsResponse.latitude;
                            longitude = gpsResponse.longitude;
                        }
                    } catch (err) {
                        console.warn("API extraction failed, trying filename fallback...", err);
                    }

                    // Fallback: Parse filename if API failed
                    if (!latitude || !longitude) {
                        const filename = item.file.name;
                        const match = filename.match(/latitude_([\d.]+)_longitude_([\d.]+)/);
                        if (match) {
                            latitude = parseFloat(match[1]);
                            longitude = parseFloat(match[2]);
                            console.log("Extracted GPS from filename:", latitude, longitude);
                        }
                    }

                    if (latitude && longitude) {
                        dispatch(updateUploadData({
                            id: item.id,
                            lat: latitude,
                            lng: longitude
                        }));

                        // 3. Save Plant
                        dispatch(updateUploadStatus({ id: item.id, status: 'saving' as any }));

                        await savePlant({
                            emailId,
                            imageName: item.file.name,
                            imageUrl,
                            latitude,
                            longitude
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
