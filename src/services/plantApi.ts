import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Plant } from '../types';

interface ExtractGPSResponse {
    latitude: number;
    longitude: number;
    message?: string;
    // Some APIs return lat/long directly or nested.
    // We'll assume the response structure based on requirements.
    // If it differs, we'll adapt.
}

interface SavePlantRequest {
    emailId: string;
    imageName: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
}

interface SavePlantResponse {
    success: boolean;
    message: string;
    data: Plant;
}



export const plantApi = createApi({
    reducerPath: 'plantApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.alumnx.com/api/hackathons/' }),
    tagTypes: ['Plants'],
    endpoints: (builder) => ({
        extractGPS: builder.mutation<ExtractGPSResponse, { emailId: string; imageName: string; imageUrl: string }>({
            query: (body) => ({
                url: 'extract-latitude-longitude',
                method: 'POST',
                body,
            }),
        }),
        savePlant: builder.mutation<SavePlantResponse, SavePlantRequest>({
            query: (body) => ({
                url: 'save-plant-location-data',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Plants'],
        }),
        getPlants: builder.query<Plant[], string>({
            query: (emailId) => ({
                url: 'get-plant-location-data',
                method: 'POST',
                body: { emailId },
            }),
            providesTags: ['Plants'],
        }),
    }),
});

export const { useExtractGPSMutation, useSavePlantMutation, useGetPlantsQuery } = plantApi;
