import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Optional: add tags or context if needed
    // formData.append('context', `original_name=${file.name}`);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onProgress) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                },
            }
        );

        return response.data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
