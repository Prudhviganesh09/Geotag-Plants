# GeoTag Farm – Visualize Plant Locations

A production-grade React + TypeScript application for farmers to visualize plant locations using geo-tagged images.

## Features
- **User Identification**: Simple email-based login (no password).
- **Image Upload**: Drag & Drop interface with Cloudinary integration.
- **Auto-GPS Extraction**: Automatically extracts GPS coordinates from uploaded images via backend API.
- **Interactive Map**: Visualize plant locations on a Leaflet map.
- **Dashboard**: Filter, sort, and search plants.
- **Offline Capable**: PWA-ready architecture.

## Tech Stack
- React 18
- TypeScript
- Vite
- Redux Toolkit + RTK Query
- Tailwind CSS
- React Leaflet
- React Dropzone
- Cloudinary

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Architecture
- **Redux Store**: Centralized state for User, Upload Queue, and UI preferences.
- **RTK Query**: Caching and state management for API calls (`plantApi`).
- **Upload Pipeline**: Sequential flow: Upload Image -> Extract GPS -> Save Plant. Managed via `useUploadProcessor` hook.

## Deployment
The project is optimized for deployment on Vercel.
1. Connect GitHub repository to Vercel.
2. Add Environment Variables in Vercel dashboard.
3. Deploy.

## Error Handling
- Invalid files are rejected.
- Cloudinary failures are reported with retry options.
- GPS extraction failures show a specific error state but allow the image to remain.

## Challenges & Solutions
- **GPS Extraction Timing**: Solved by using an effect-based `useUploadProcessor` hook that watches the upload queue and triggers the next step only when the previous one succeeds.
- **Map & List Synchronization**: Managed via shared Redux state (`viewMode`, `searchQuery`, `sortBy`) ensuring both views are always in sync.
