# Yarba Frontend

This is the frontend application for Yarba, a platform for building and managing your resume and career materials.

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm (v7 or newer)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mucahitkayadan/yarba-frontend.git
   cd yarba-frontend
   ```

2. Run the setup script to install dependencies and create environment files:
   ```
   # Make the script executable (Unix-based systems)
   chmod +x setup_deps.sh
   
   # Run the script
   ./setup_deps.sh
   ```
   
   Alternatively, you can manually install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Environment Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the project root with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

## Dependency Notes

This project uses specific versions of packages to ensure compatibility:

- React 18.x (not compatible with React 19)
- Material UI 5.x (not compatible with MUI 7)
- React Router 6.x
- Firebase 10.x

When updating dependencies, be cautious about breaking changes. If you encounter issues with ESLint or other dependencies, you can run:

```
npm install --legacy-peer-deps
```

## Testing the Firebase Authentication

The application includes a Firebase test page at `/firebase-test` where you can:
- Test direct Google sign-in
- View your Firebase token
- Manually exchange the Firebase token for a backend JWT
- Check your authenticated user information

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Deployment

This application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy when you push changes to your main branch.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
