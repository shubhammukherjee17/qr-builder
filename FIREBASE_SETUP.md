# Firebase Setup Guide for QR Builder

This guide will help you set up Firebase for the QR Builder application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter a project name (e.g., "qr-builder")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Firebase Authentication

1. In the Firebase console, go to **Authentication**
2. Click on the **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Optionally enable other providers (Google, GitHub, etc.)

## 3. Set up Firestore Database

1. In the Firebase console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** for development
4. Select a location closest to your users
5. Click **Done**

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Add app** and select **Web** (</> icon)
4. Enter an app nickname (e.g., "QR Builder Web")
5. Click **Register app**
6. Copy the Firebase configuration object

## 5. Set up Firebase Admin SDK (for server-side operations)

1. In the Firebase console, go to **Project Settings**
2. Click on the **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file and keep it secure
5. Extract the required values for environment variables

## 6. Update Environment Variables

Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key-here"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key-content-here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Replace all placeholder values with your actual Firebase configuration
- The `FIREBASE_PRIVATE_KEY` should include the full private key with proper line breaks
- Keep the private key secure and never commit it to version control

## 7. Configure Firestore Security Rules

In the Firestore console, update the security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // QR codes can be read by everyone if public, or by owner
    match /qrcodes/{qrCodeId} {
      allow read: if resource.data.isPublic == true || 
                     (request.auth != null && request.auth.uid == resource.data.userId);
      allow write: if request.auth != null && 
                      (request.auth.uid == resource.data.userId || !exists(/databases/$(database)/documents/qrcodes/$(qrCodeId)));
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Analytics can be created by anyone, read by QR code owner
    match /analytics/{analyticsId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Try to register a new user
3. Create a QR code
4. Check that data appears in Firestore console

## 9. Production Considerations

For production deployment:

1. **Environment Variables**: Use your hosting platform's environment variable settings
2. **Security Rules**: Review and tighten Firestore security rules
3. **Authentication**: Configure authorized domains in Firebase Authentication settings
4. **Billing**: Set up billing for Firebase if you expect high usage

## Troubleshooting

### Common Issues:

1. **"Firebase App not initialized"**
   - Check that all environment variables are correctly set
   - Ensure environment variables are prefixed with `NEXT_PUBLIC_` for client-side usage

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Ensure user is properly authenticated

3. **"Private key" errors**
   - Ensure the private key includes proper line breaks
   - Check that the service account email is correct

### Support

If you encounter issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- Firebase console error logs
