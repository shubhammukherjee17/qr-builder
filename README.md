# QR Builder with 3D Effects & Supabase Backend

A modern, feature-rich QR code generator with stunning 3D animations, extensive customization options, and powerful database integration using Supabase.

## ✨ Features

### 🎨 **3D Visual Experience**
- Full-page 3D background with animated QR cube
- Floating geometric shapes and particle systems
- Interactive 3D elements throughout the interface
- Smooth animations using Framer Motion

### 🛠️ **QR Code Generation**
- **7 QR Types**: Text, URL, Email, Phone, SMS, WiFi, vCard
- **Advanced Customization**:
  - Colors & gradients (linear, radial)
  - Dot styles (square, rounded, dots)
  - Corner styles (square, rounded, extra-rounded)
  - Pattern styles and corner radius
  - Error correction levels (L, M, Q, H)
  - Logo embedding with size control

### 🗄️ **Database Integration (Supabase)**
- **QR History**: Automatically saves all generated QR codes
- **Quick Templates**: Pre-configured templates for common use cases
- **Batch Generation**: Upload CSV files to generate multiple QR codes
- **Analytics Tracking**: Scan count and performance metrics
- **Export Options**: PDF, SVG, and analytics reports

### 📱 **Export Features**
- **PNG Download**: High-quality raster images
- **PDF Export**: Vector-perfect documents using jsPDF
- **SVG Export**: Scalable vector graphics
- **Batch Processing**: Generate multiple QR codes from CSV data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### 1. Clone and Install
```bash
git clone <your-repo>
cd qr-builder
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)

#### Set up Database
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `schema.sql` into the editor
4. Click **Run** to create all tables and functions

#### Get Your API Keys
1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon/public key**

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your QR Builder in action! 🎉

## 📊 Database Schema

### Tables Created:
- **`qr_codes`**: Stores generated QR codes with metadata
- **`qr_templates`**: Pre-configured templates for quick generation
- **`qr_analytics`**: Tracks QR code scans and usage statistics

### Key Features:
- UUID primary keys
- JSONB fields for flexible data storage
- Automatic timestamps
- Performance indexes
- Built-in functions for analytics

## 🎯 How to Use

### Basic QR Generation
1. Select QR type from the dropdown
2. Fill in the required data
3. Customize colors, size, and style
4. Click **Generate QR Code**
5. Download or copy your QR code

### Quick Templates
- Click any template button in the right sidebar
- Form will auto-populate with template data
- Customize and generate immediately

### Batch Generation
1. Prepare a CSV file with format: `type,content`
   ```csv
   URL,https://example.com
   TEXT,Hello World
   EMAIL,hello@example.com
   ```
2. Click the CSV upload area in **Batch Generator**
3. Select your file
4. QR codes will be generated automatically

### Export Options
- **PNG**: Standard download (right-click → Save)
- **PDF**: Vector-perfect document export
- **SVG**: Scalable vector graphics
- **Analytics**: Export with usage statistics

## 🔧 Advanced Customization

### QR Code Styles
- **Error Correction**: Higher levels = more damage resistance
- **Gradients**: Linear and radial gradient support
- **Patterns**: Choose from various dot and corner styles
- **Logo Integration**: Add custom logos with size control

### 3D Scene Customization
Modify `src/components/QRCube3D.tsx` to:
- Change particle count and behavior
- Adjust floating geometry types
- Modify lighting and materials
- Add new 3D elements

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full 3-column layout with all features
- **Tablet**: Adapted layout with stacked elements
- **Mobile**: Optimized single-column view


## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with Turbopack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### 3D Graphics
- **Three.js** for 3D rendering
- **@react-three/fiber** for React integration
- **@react-three/drei** for utilities

### Database & Backend
- **Supabase** for database and real-time features
- **PostgreSQL** with JSONB support
- **Row Level Security** ready

### QR & Export
- **qrcode** library for QR generation
- **jsPDF** for PDF export
- **Canvas API** for image manipulation

## 🔒 Security Notes

- All QR generation happens client-side
- Database stores only metadata (no sensitive data)
- Environment variables are public (frontend-only)
- Enable RLS in Supabase for user-specific data

## 📈 Future Enhancements

- [ ] User authentication with Supabase Auth
- [ ] Real-time QR scan analytics
- [ ] QR code expiration and access control
- [ ] Team collaboration features
- [ ] API endpoint for external integrations
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

Having issues? Check:
1. Supabase project is active and accessible
2. Environment variables are correctly set
3. Database schema was applied successfully
4. Browser console for any errors

For more help, create an issue in the repository.

---

**Built with ❤️ by Shubham Mukherjee**
