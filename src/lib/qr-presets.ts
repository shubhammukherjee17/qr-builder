export interface StylePreset {
  id: string
  name: string
  description: string
  fgColor: string
  bgColor: string
  gradientType: 'none' | 'linear' | 'radial'
  gradientColor?: string
  dotStyle: 'square' | 'rounded' | 'dots'
  cornerStyle: 'square' | 'rounded' | 'extra-rounded'
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    description: 'QRLink signature blue',
    fgColor: '#2563eb',
    bgColor: '#ffffff',
    gradientType: 'linear',
    gradientColor: '#3b82f6',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
  {
    id: 'cyan-wave',
    name: 'Cyan Sky',
    description: 'Vibrant clean aqua',
    fgColor: '#0284c7',
    bgColor: '#ffffff',
    gradientType: 'none',
    dotStyle: 'dots',
    cornerStyle: 'extra-rounded',
  },
  {
    id: 'fuchsia-pink',
    name: 'Magenta Pop',
    description: 'Modern energetic rose',
    fgColor: '#e11d48',
    bgColor: '#ffffff',
    gradientType: 'none',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
  {
    id: 'obsidian-navy',
    name: 'Classic Navy',
    description: 'Crisp high-contrast',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    gradientType: 'none',
    dotStyle: 'square',
    cornerStyle: 'square',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant rich violet',
    fgColor: '#7c3aed',
    bgColor: '#ffffff',
    gradientType: 'linear',
    gradientColor: '#a855f7',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
  {
    id: 'teal-mint',
    name: 'Teal Emerald',
    description: 'Fresh mint botanic',
    fgColor: '#0d9488',
    bgColor: '#ffffff',
    gradientType: 'none',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
  {
    id: 'sunset-blaze',
    name: 'Sunset Blaze',
    description: 'Hot orange to vivid magenta',
    fgColor: '#ea580c',
    bgColor: '#ffffff',
    gradientType: 'linear',
    gradientColor: '#db2777',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
  {
    id: 'cyber-lime',
    name: 'Cyber Lime',
    description: 'Electrifying neon lime',
    fgColor: '#16a34a',
    bgColor: '#ffffff',
    gradientType: 'linear',
    gradientColor: '#059669',
    dotStyle: 'dots',
    cornerStyle: 'extra-rounded',
  },
  {
    id: 'ultra-crimson',
    name: 'Ultra Crimson',
    description: 'High-voltage bold red',
    fgColor: '#dc2626',
    bgColor: '#ffffff',
    gradientType: 'none',
    dotStyle: 'rounded',
    cornerStyle: 'rounded',
  },
]
