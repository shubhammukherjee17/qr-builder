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
  logoUrl?: string
  logoSize?: number
}

export interface QRCodeData {
  type: QRType
  content: string
  style?: QRCodeStyle
}
