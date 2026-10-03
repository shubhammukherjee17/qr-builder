# Qraft — Beautiful QR Codes for Anything

<p align="center">
  <img src="https://raw.githubusercontent.com/shubhammukherjee17/qr-builder/main/public/favicon.ico" width="48" height="48" alt="Qraft Logo" />
</p>

<p align="center">
  <strong>Generate, customize, and download high-quality QR codes in real time — 100% free, no sign up, no watermark.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.10-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 🎨 Visual Identity & Maximalist Aesthetic

Qraft is designed with a **rich, maximalist collage aesthetic**:
- **Botanical Framing**: Tropical Monstera leaves and palm fronds framing the canvas.
- **Watercolor Splashes**: Soft, vibrant gouache and watercolor splash blooms (magenta, sunshine yellow, cyan, purple).
- **Handcrafted Accents**: Washi tape strips, retro stamps, doodle crowns (👑), disco ball sketches (🪩), stars (✦), and arrows (➔).
- **Handwritten Typography**: Organic annotations using Google Font **Caveat** (`font-handwriting`) paired with clean **Geist** typography.
- **100% Mobile-Friendly**: Responsive single-column flow on mobile viewports with comfortable touch targets (≥44px), mobile quick preview bar, and guaranteed zero button truncation.

---

## ✨ Features

### 🛠️ 12 Payload Types
Create scannable QR codes for any use case:
1. **Website**: Direct link to any URL (`https://...`).
2. **Text**: Share plain text, secret notes, or quotes.
3. **Email**: Pre-filled email with recipient, subject, and body.
4. **Phone**: Direct telephone dialing (`tel:+...`).
5. **Wi-Fi**: Automatic network connection with SSID, password, and security type (WPA/WEP/None).
6. **Location / Maps**: Universal `geo:` URI standard (RFC 5870) and Google Maps links.
7. **vCard**: Complete digital business card (Name, Organization, Phone, Email, Website).
8. **Social Media**: Link Instagram, LinkedIn, YouTube, TikTok, and X.
9. **PDF**: Document and brochure links.
10. **App Download**: iOS App Store and Google Play store redirection.
11. **Restaurant Menu**: Contactless digital menu links.
12. **Custom / More**: Open payload for custom data schemes.

### 🎨 Deep Customization Studio
- **Patterns**: Choose between **Square**, **Rounded**, and **Dots** module patterns.
- **Corner Eyes**: Select from **Square**, **Rounded**, and **Circle** finder styles.
- **Color Palette**: 9 curated brand colors plus a custom **HEX** color picker.
- **Center Logo**: Upload custom PNG/SVG logo with automatic cutout and error-correction level boost.
- **Frame & Caption**: Customizable frame text underneath the QR code (e.g., *"Scan to visit My Website"*).
- **Dynamic Toggle**: Visual indicator for dynamic destination routing.
- **Advanced Engine**: Fine-tune Quiet Zone margin, resolution size (256px – 1024px), and Error Correction Levels (**L**, **M**, **Q**, **H**).

### 📱 Live Scannable Preview & Instant Export
- **Real-Time HTML5 Canvas**: Updates instantly on every keystroke.
- **PNG Download**: Crisp, high-resolution raster image.
- **SVG Export**: Scalable, vector-perfect SVG markup for print flyers and billboards.
- **PDF Export**: Print-ready formatted PDF document generated with `jsPDF`.
- **1-Click Clipboard Copy**: Copies image blob directly to clipboard with instant feedback.
- **Mobile Quick Preview**: Compact top banner on mobile screens allowing immediate download and copy without scrolling.

### 📋 Showcase Templates
Curated, pre-designed templates for instant inspiration:
- **The Daily Grind**: Coffee Shop & cafe ordering.
- **Follow Us**: Instagram social follow card.
- **THE GREEN TABLE**: Organic restaurant menu.
- **Join Our Wi-Fi**: Contactless guest Wi-Fi connection.
- **Download Our App**: Mobile app download card with store badges.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` or `pnpm` or `yarn`

### 1. Clone & Install
```bash
git clone https://github.com/shubhammukherjee17/qr-builder.git
cd qr-builder
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🏗️ Project Architecture

```
qr-builder/
├── public/                 # Static assets and icons
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind CSS v4, maximalist tokens & shadows
│   │   ├── layout.tsx      # Root layout, Geist & Caveat font configurations
│   │   └── page.tsx        # Homepage, hero collage, use cases, templates
│   ├── components/
│   │   ├── CollageDecorations.tsx # Monstera leaves, palm fronds, stamps, doodles
│   │   └── QRBuilder.tsx   # Live studio workbench & responsive export controls
│   ├── lib/
│   │   ├── qr-presets.ts   # Preset styles & templates
│   │   ├── qr-renderer.ts  # HTML5 Canvas QR rendering engine
│   │   └── supabase.ts     # Supabase client configuration
│   └── types/
│       └── index.ts        # TypeScript definitions for QR types & styles
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with Turbopack compiler
- **UI Library**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Geist](https://vercel.com/font) & [Caveat](https://fonts.google.com/specimen/Caveat) via `next/font`
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode)
- **PDF Export**: [jsPDF](https://www.npmjs.com/package/jspdf)
- **Backend Ready**: [Supabase](https://supabase.com/) client integration

---

## 🔒 Privacy & Security

- **100% Client-Side Generation**: QR code matrix calculations and canvas rendering happen entirely inside the browser.
- **No Tracking / No Intermediaries**: Generated URLs point directly to your destination with no middleman tracking redirects.
- **No Watermarks**: Your exported files are clean and unrestricted for both personal and commercial use.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it for personal or commercial projects.

---

<p align="center">
  Built with ❤️ by <strong>Shubham Mukherjee</strong>
</p>
