import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Plant } from '../types';

interface ExtractGPSResponse {
    latitude: number;
    longitude: number;
    message?: string;
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

// Custom base query to intercept errors (like 404) and handle them gracefully
const baseQuery = fetchBaseQuery({ baseUrl: 'https://api.alumnx.com/api/hackathons/' });

const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Intercept 404 for get-plant-location-data and treat as empty list
    if (result.error && result.error.status === 404) {
        const url = typeof args === 'string' ? args : args.url;
        if (url.includes('get-plant-location-data')) {
            return { data: { success: true, data: [] } };
        }
    }
    return result;
};

export const plantApi = createApi({
    reducerPath: 'plantApi',
    baseQuery: customBaseQuery,
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
            transformResponse: (response: { success: boolean, data: Plant[] | null, error?: string }) => {
                if (!response.success || !response.data) {
                    return [];
                }
                return response.data;
            },
        }),
    }),
});

export const { useExtractGPSMutation, useSavePlantMutation, useGetPlantsQuery } = plantApi;
