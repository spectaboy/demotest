# URide - University Ridesharing Platform

URide is a modern ridesharing platform designed specifically for university students. It connects drivers and riders within the university community, helps organize community events, and promotes sustainable transportation options.



## Features

- **Ridesharing**: Connect drivers with riders for campus commutes
- **Community Events**: Discover and join university events
- **Progress Tracking**: Track savings and achievements
- **Real-time Chat**: Communicate with drivers or riders
- **Interactive Maps**: View routes and locations with Google Maps integration
- **User Profiles**: Manage your profile and preferences

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Maps**: Google Maps API
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Analytics**: Firebase Analytics

## Contributing

We welcome contributions to improve URide! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and naming conventions
- Write meaningful commit messages
- Add appropriate comments for complex logic
- Update documentation for significant changes


## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Firebase account
- Google Maps API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uride.git
   cd uride
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit the .env.local file with your actual credentials
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Setup

This project uses environment variables to store sensitive information like API keys. Follow these steps to set up your environment:

1. Copy `.env.example` to `.env.local`
2. Replace the placeholder values with your actual API keys and configuration

**IMPORTANT: Never commit your `.env.local` file to version control. It contains sensitive information.**

### Firebase Configuration

The Firebase configuration requires the following environment variables in your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Google Maps API

For the map functionality to work, you need to provide a Google Maps API key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Project Structure

- `/components` - Reusable UI components
- `/contexts` - React context providers
- `/lib` - Utility functions and service configurations
- `/public` - Static assets
- `/services` - API and service integrations
- `/src/app` - Next.js app router pages
- `/utils` - Helper functions


## Deployment

The easiest way to deploy URide is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com) - UI component library
- [Firebase](https://firebase.google.com) - Backend services
- [Google Maps Platform](https://developers.google.com/maps) - Maps and location services
