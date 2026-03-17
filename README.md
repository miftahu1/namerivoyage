# Nameri Voyage – Arunodoi Academy

This is a Next.js application for managing the Class 12 school excursion to Nameri National Park.

## Features

- **Real-time Synchronization**: Powered by Firebase Firestore for live updates on student registrations and teacher announcements.
- **Admin Portal**: Secure access for teachers to manage approvals, track fee payments, and broadcast updates.
- **Mobile Optimized**: Responsive design for easy access on smartphones.
- **AI-Powered Tools**: Genkit flows for generating trip descriptions, packing lists, and announcements.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/miftahu1/namerivoyage.git
   cd namerivoyage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Administrative Access

The admin portal is available at `/admin`. The default access code is `Nameri@26`.

## Deployment

This project is configured for Firebase App Hosting. See `apphosting.yaml` for configuration details.
