# QR Builder

A free, unlimited QR code generator built with Next.js, TypeScript, and modern web technologies. **No signups • No limits • 100% free forever!**

## Features

### 🎯 Core Features
- **Multiple QR Code Types**: Text, URL, Email, Phone, SMS, WiFi, vCard
- **Custom Styling**: Colors, sizes, margins with real-time preview
- **Instant Generation**: Create QR codes instantly with no delays
- **High Quality Downloads**: Save QR codes as PNG images
- **No Registration Required**: Use immediately without creating an account

### 🎨 Design & UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful interface built with Tailwind CSS
- **3D Interactive Elements**: Animated QR cube with Three.js
- **Smooth Scrolling**: Enhanced user experience with Lenis
- **Intuitive Interface**: Easy-to-use form controls and instant feedback

### ✨ Advanced Features
- **Client-Side Generation**: All processing done locally for privacy
- **Type Safety**: Full TypeScript implementation for reliability
- **Optimized Performance**: Fast loading and smooth interactions
- **Copy to Clipboard**: Easy sharing with one-click copy functionality

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **3D Graphics**: Three.js with React Three Fiber
- **QR Generation**: qrcode library
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **Build Tool**: Turbopack for fast builds

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Usage

### Creating QR Codes

1. **Choose QR Code Type**: Select from Text, URL, Email, Phone, SMS, WiFi, or vCard
2. **Enter Data**: Fill in the required information for your chosen type
3. **Customize Style**: Adjust colors, size, and margin with live preview
4. **Generate**: Click "Generate QR Code" to create your QR code instantly
5. **Download**: Save the QR code as a high-quality PNG image
6. **Copy**: Copy the QR code image to your clipboard for easy sharing

### Key Benefits

- **No Registration**: Start creating QR codes immediately
- **Unlimited Usage**: Generate as many QR codes as you need
- **Privacy First**: All processing happens in your browser
- **Always Free**: No hidden costs or premium features
- **Works Offline**: Generate QR codes even without internet (after initial load)


## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles with custom animations
│   ├── layout.tsx      # App layout
│   └── page.tsx        # Home page with hero and QR builder
├── components/         # React components
│   ├── QRBuilder.tsx   # Main QR code generator
│   └── QRCube3D.tsx    # 3D animated QR cube
├── hooks/             # Custom React hooks
│   └── useSmoothScroll.tsx # Smooth scrolling with Lenis
├── lib/               # Utility libraries
│   └── qr-utils.ts    # QR code generation utilities
├── types/             # TypeScript definitions
│   └── index.ts       # App-wide type definitions
└── README.md          # Project documentation
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework with Turbopack
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Lucide React](https://lucide.dev/) - Beautiful icon library
- [QRCode](https://github.com/soldair/node-qrcode) - QR code generation
- [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling library

---

**Happy QR Code Building! 🚀**
