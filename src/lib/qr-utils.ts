import QRCode from 'qrcode'
import { QRType, QRCodeStyle, QRCodeData } from '@/types'


const defaultStyle: QRCodeStyle = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 256,
  margin: 4,
}

export async function generateQRCode(data: QRCodeData): Promise<string> {
  const style = { ...defaultStyle, ...data.style }
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data.content, {
      color: {
        dark: style.foregroundColor,
        light: style.backgroundColor,
      },
      width: style.size,
      margin: style.margin,
    })
    
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export function formatContent(type: QRType, data: Record<string, string | boolean>): string {
  // Helper function to safely convert to string
  const toString = (value: string | boolean | undefined): string => {
    return typeof value === 'string' ? value : (value === true ? 'true' : (value === false ? 'false' : ''))
  }

  switch (type) {
    case QRType.TEXT:
      return toString(data.text)
    
    case QRType.URL:
      return toString(data.url)
    
    case QRType.EMAIL:
      return `mailto:${toString(data.email)}?subject=${encodeURIComponent(toString(data.subject))}&body=${encodeURIComponent(toString(data.body))}`
    
    case QRType.PHONE:
      return `tel:${toString(data.phone)}`
    
    case QRType.SMS:
      return `sms:${toString(data.phone)}?body=${encodeURIComponent(toString(data.message))}`
    
    case QRType.WIFI:
      return `WIFI:T:${toString(data.security)};S:${toString(data.ssid)};P:${toString(data.password)};H:${data.hidden || false};;`
    
    case QRType.VCARD:
      return `BEGIN:VCARD
VERSION:3.0
FN:${toString(data.name)}
ORG:${toString(data.organization)}
TEL:${toString(data.phone)}
EMAIL:${toString(data.email)}
URL:${toString(data.website)}
NOTE:${toString(data.note)}
END:VCARD`
    
    default:
      return toString(data.content)
  }
}

export function parseQRContent(type: QRType, content: string): Record<string, string | boolean> {
  switch (type) {
    case QRType.TEXT:
      return { text: content }
    
    case QRType.URL:
      return { url: content }
    
    case QRType.EMAIL:
      const emailMatch = content.match(/mailto:([^?]+)(?:\?subject=([^&]+))?(?:&body=(.+))?/)
      return {
        email: emailMatch?.[1] || '',
        subject: decodeURIComponent(emailMatch?.[2] || ''),
        body: decodeURIComponent(emailMatch?.[3] || ''),
      }
    
    case QRType.PHONE:
      return { phone: content.replace('tel:', '') }
    
    case QRType.SMS:
      const smsMatch = content.match(/sms:([^?]+)(?:\?body=(.+))?/)
      return {
        phone: smsMatch?.[1] || '',
        message: decodeURIComponent(smsMatch?.[2] || ''),
      }
    
    case QRType.WIFI:
      const wifiMatch = content.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);/)
      return {
        security: wifiMatch?.[1] || '',
        ssid: wifiMatch?.[2] || '',
        password: wifiMatch?.[3] || '',
        hidden: wifiMatch?.[4] === 'true',
      }
    
    case QRType.VCARD:
      const lines = content.split('\n')
      const vcard: Record<string, string | boolean> = {}
      lines.forEach(line => {
        if (line.startsWith('FN:')) vcard.name = line.substring(3)
        if (line.startsWith('ORG:')) vcard.organization = line.substring(4)
        if (line.startsWith('TEL:')) vcard.phone = line.substring(4)
        if (line.startsWith('EMAIL:')) vcard.email = line.substring(6)
        if (line.startsWith('URL:')) vcard.website = line.substring(4)
        if (line.startsWith('NOTE:')) vcard.note = line.substring(5)
      })
      return vcard
    
    default:
      return { content }
  }
}
