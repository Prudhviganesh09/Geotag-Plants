export interface UserState {
    emailId: string | null;
}

export interface Plant {
    _id: string; // Assuming API returns _id
    emailId: string;
    imageName: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    uploadedAt: string; // ISO date
}

export interface UploadItem {
    id: string; // unique internal ID
    file: File;
    previewUrl: string;
    status: 'idle' | 'uploading' | 'uploaded' | 'gpsProcessing' | 'saved' | 'error';
    progress: number;
    error?: string;
    // API response data
    imageUrl?: string;
    lat?: number;
    lng?: number;
}

export interface UIState {
    toasts: Toast[];
    viewMode: 'map' | 'list';
    searchQuery: string;
    sortBy: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}
