<<<<<<< HEAD
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
# Uber Clone

A React Native app built with Expo that replicates core Uber functionality including ride booking, driver selection, and payment processing.

## Features

- 🚗 Driver selection and booking
- 📍 Location search and mapping
- 💳 Stripe payment integration
- 🔐 Clerk authentication
- 🗺️ Real-time driver location and ETA
- 💰 Dynamic pricing based on distance

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Neon Database account
- Stripe account
- Clerk account

### Environment Variables

Create a `.env` file in the root directory with:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Google Maps API Key (if needed)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Geoapify API Key (for static maps)
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

### Database Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database tables:
   ```bash
   npm run setup-db
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

- `app/` - Expo Router screens and navigation
- `components/` - Reusable UI components
- `lib/` - Utility functions and API helpers
- `store/` - Zustand state management
- `types/` - TypeScript type definitions

## API Endpoints

- `POST /api/ride/create` - Create a new ride
- `GET /api/driver` - Fetch available drivers
- `POST /api/stripe/create` - Initialize Stripe payment
- `POST /api/stripe/pay` - Process payment

## Troubleshooting

If you encounter the error "relation 'rides' does not exist", run:
```bash
npm run setup-db
```

This will create all necessary database tables and insert sample driver data.
>>>>>>> 2b60a3ce87a83cd45ae6934390a4e3cf5b7fe7ee
