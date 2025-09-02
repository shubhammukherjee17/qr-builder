export enum QRType {
  TEXT = 'TEXT',
  URL = 'URL',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  SMS = 'SMS',
  WIFI = 'WIFI',
  VCARD = 'VCARD'
}

export interface QRCodeStyle {
  foregroundColor: string
  backgroundColor: string
  size: number
  margin: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  logoUrl?: string
  logoSize?: number
  cornerRadius?: number
  dotStyle: 'square' | 'rounded' | 'dots'
  cornerStyle: 'square' | 'rounded' | 'extra-rounded'
  gradientType: 'none' | 'linear' | 'radial'
  gradientColor?: string
  pattern: 'default' | 'dots' | 'squares' | 'rounded'
}

export interface QRCodeData {
  type: QRType
  content: string
  style?: QRCodeStyle
}
