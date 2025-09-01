# QR Builder

A complete full-stack QR code generator application built with Next.js, TypeScript, and modern web technologies.

## Features

### 🎯 Core Features
- **Multiple QR Code Types**: Text, URL, Email, Phone, SMS, WiFi, vCard
- **Custom Styling**: Colors, sizes, margins, and logo embedding
- **Real-time Preview**: See your QR code as you create it
- **Download & Share**: Save QR codes in various formats

### 👤 User Management
- **Authentication**: Sign up and sign in functionality
- **Personal Gallery**: Save and manage your QR codes
- **Public Gallery**: Browse QR codes shared by the community
- **Analytics**: Track scans and usage statistics

### 🎨 Design & UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS
- **Dark/Light Support**: Adaptive color schemes
- **Intuitive Interface**: Easy-to-use form controls

### 🔧 Advanced Features
- **Database Storage**: Cloud storage with Firebase Firestore
- **RESTful API**: Clean API endpoints for all operations
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Live data synchronization with Firestore

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **QR Generation**: qrcode library
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Firebase**
   Follow the detailed setup guide in `FIREBASE_SETUP.md`

3. **Configure environment variables**
   Update the `.env` file with your Firebase configuration:
   ```
   # Firebase Configuration (Client-side)
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   
   # Firebase Admin SDK (Server-side)
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating QR Codes

1. **Choose QR Code Type**: Select from Text, URL, Email, Phone, SMS, WiFi, or vCard
2. **Enter Data**: Fill in the required information for your chosen type
3. **Customize Style**: Adjust colors, size, and margin
4. **Generate**: Click "Generate QR Code" to create your QR code
5. **Download**: Save the QR code as a PNG image

### Managing QR Codes

- **Sign Up**: Create an account to save your QR codes
- **Gallery**: View all your created QR codes
- **Analytics**: Track how many times your QR codes have been scanned
- **Public Sharing**: Make your QR codes public for others to see

## API Endpoints

### QR Codes
- `POST /api/qr/generate` - Generate and save QR code
- `GET /api/qr/generate` - Get user's QR codes or public QR codes
- `GET /api/qr/[id]` - Get specific QR code details
- `DELETE /api/qr/[id]` - Delete QR code
- `POST /api/qr/[id]/scan` - Record QR code scan
- `GET /api/qr/[id]/scan` - Get QR code analytics

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/qr/         # QR code API routes
│   ├── gallery/        # Gallery page
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── QRBuilder.tsx   # Main QR builder
│   ├── QRGallery.tsx   # QR code gallery
│   └── QRScanner.tsx   # QR code scanner
├── contexts/           # React contexts
│   └── AuthContext.tsx # Firebase authentication context
├── lib/               # Utility libraries
│   ├── firebase.ts     # Firebase client config
│   ├── firebase-admin.ts # Firebase admin config
│   └── qr-utils.ts    # QR code utilities
├── services/          # Business logic
│   └── firestore.ts   # Firestore operations
├── types/             # TypeScript definitions
│   └── index.ts       # App-wide type definitions
└── FIREBASE_SETUP.md  # Firebase setup guide
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend platform and database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icons
- [QRCode](https://github.com/soldair/node-qrcode) - QR code generation

---

**Happy QR Code Building! 🚀**
