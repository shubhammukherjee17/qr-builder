'use client'

import { useState, useRef } from 'react'
import { QRType, QRCodeStyle } from '@/types'
import { Download, Copy, RefreshCw } from 'lucide-react'
import QRCode from 'qrcode'

const QR_TYPES = [
  { value: QRType.TEXT, label: 'Text' },
  { value: QRType.URL, label: 'Website URL' },
  { value: QRType.EMAIL, label: 'Email' },
  { value: QRType.PHONE, label: 'Phone Number' },
  { value: QRType.SMS, label: 'SMS Message' },
  { value: QRType.WIFI, label: 'WiFi Network' },
  { value: QRType.VCARD, label: 'Contact Card' },
]

export default function QRBuilder() {
  const [selectedType, setSelectedType] = useState<QRType>(QRType.TEXT)
  const [qrData, setQrData] = useState<Record<string, string | boolean>>({})
  const [style, setStyle] = useState<QRCodeStyle>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    size: 256,
    margin: 4,
  })
  const [qrImageUrl, setQrImageUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDataChange = (key: string, value: string | boolean) => {
    setQrData(prev => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (key: keyof QRCodeStyle, value: string | number) => {
    setStyle(prev => ({ ...prev, [key]: value }))
  }

  const formatQRContent = (): string => {
    // Helper function to safely convert to string
    const toString = (value: string | boolean | undefined): string => {
      return typeof value === 'string' ? value : (value === true ? 'true' : (value === false ? 'false' : ''))
    }

    switch (selectedType) {
      case QRType.TEXT:
        return toString(qrData.text)
      case QRType.URL:
        return toString(qrData.url)
      case QRType.EMAIL:
        const emailParts = [`mailto:${toString(qrData.email)}`]
        const subject = toString(qrData.subject)
        const body = toString(qrData.body)
        if (subject) emailParts.push(`subject=${encodeURIComponent(subject)}`)
        if (body) emailParts.push(`body=${encodeURIComponent(body)}`)
        return emailParts.join(emailParts.length > 1 ? '?' : '') + (emailParts.length > 2 ? emailParts.slice(2).join('&') : '')
      case QRType.PHONE:
        return `tel:${toString(qrData.phone)}`
      case QRType.SMS:
        const message = toString(qrData.message)
        return `sms:${toString(qrData.phone)}${message ? `?body=${encodeURIComponent(message)}` : ''}`
      case QRType.WIFI:
        return `WIFI:T:${toString(qrData.security) || 'WPA'};S:${toString(qrData.ssid)};P:${toString(qrData.password)};H:${qrData.hidden ? 'true' : 'false'};;`
      case QRType.VCARD:
        const vcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${toString(qrData.name)}`,
          qrData.organization ? `ORG:${toString(qrData.organization)}` : '',
          qrData.phone ? `TEL:${toString(qrData.phone)}` : '',
          qrData.email ? `EMAIL:${toString(qrData.email)}` : '',
          qrData.website ? `URL:${toString(qrData.website)}` : '',
          qrData.note ? `NOTE:${toString(qrData.note)}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\n')
        return vcard
      default:
        return ''
    }
  }

  const generateQR = async () => {
    const content = formatQRContent()
    if (!content.trim()) {
      alert('Please fill in the required data')
      return
    }

    setIsGenerating(true)
    try {
      // Generate QR code using qrcode library
      const canvas = canvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, content, {
          width: style.size,
          margin: style.margin,
          color: {
            dark: style.foregroundColor,
            light: style.backgroundColor
          },
          errorCorrectionLevel: 'M'
        })
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png')
        setQrImageUrl(dataUrl)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      alert('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = () => {
    if (qrImageUrl) {
      const link = document.createElement('a')
      link.href = qrImageUrl
      link.download = 'qr-code.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const copyQRData = async () => {
    if (qrImageUrl) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrImageUrl)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        alert('QR code copied to clipboard!')
      } catch (error) {
        // Fallback to copying the data URL as text
        try {
          await navigator.clipboard.writeText(qrImageUrl)
          alert('QR code data URL copied to clipboard!')
        } catch (fallbackError) {
          console.error('Failed to copy to clipboard:', error, fallbackError)
          alert('Failed to copy QR code')
        }
      }
    }
  }

  const renderDataForm = () => {
    switch (selectedType) {
      case QRType.TEXT:
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Text Content</label>
            <textarea
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              placeholder="Enter your text here"
              value={String(qrData.text || '')}
              onChange={(e) => handleDataChange('text', e.target.value)}
            />
          </div>
        )

      case QRType.URL:
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Website URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com"
              value={String(qrData.url || '')}
              onChange={(e) => handleDataChange('url', e.target.value)}
            />
          </div>
        )

      case QRType.EMAIL:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="example@email.com"
                value={String(qrData.email || '')}
                onChange={(e) => handleDataChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject (Optional)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Email subject"
                value={String(qrData.subject || '')}
                onChange={(e) => handleDataChange('subject', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message (Optional)</label>
              <textarea
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                placeholder="Email message"
                value={String(qrData.body || '')}
                onChange={(e) => handleDataChange('body', e.target.value)}
              />
            </div>
          </div>
        )

      case QRType.PHONE:
        return (
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
              placeholder="+1234567890"
              value={String(qrData.phone || '')}
              onChange={(e) => handleDataChange('phone', e.target.value)}
            />
          </div>
        )

      case QRType.SMS:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                placeholder="+1234567890"
                value={String(qrData.phone || '')}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                placeholder="SMS message"
                value={String(qrData.message || '')}
                onChange={(e) => handleDataChange('message', e.target.value)}
              />
            </div>
          </div>
        )

      case QRType.WIFI:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Network Name (SSID)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="WiFi Network Name"
                value={String(qrData.ssid || '')}
                onChange={(e) => handleDataChange('ssid', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                placeholder="WiFi Password"
                value={String(qrData.password || '')}
                onChange={(e) => handleDataChange('password', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Security Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value={String(qrData.security || 'WPA')}
                onChange={(e) => handleDataChange('security', e.target.value)}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open Network</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hidden"
                className="mr-2"
                checked={Boolean(qrData.hidden)}
                onChange={(e) => handleDataChange('hidden', e.target.checked)}
              />
              <label htmlFor="hidden" className="text-sm">Hidden Network</label>
            </div>
          </div>
        )

      case QRType.VCARD:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="John Doe"
                value={String(qrData.name || '')}
                onChange={(e) => handleDataChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Organization</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Company Name"
                value={String(qrData.organization || '')}
                onChange={(e) => handleDataChange('organization', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                placeholder="+1234567890"
                value={String(qrData.phone || '')}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="john@example.com"
                value={String(qrData.email || '')}
                onChange={(e) => handleDataChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com"
                value={String(qrData.website || '')}
                onChange={(e) => handleDataChange('website', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md resize-none"
                rows={2}
                placeholder="Additional notes"
                value={String(qrData.note || '')}
                onChange={(e) => handleDataChange('note', e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Builder Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Create QR Code</h2>
            
            {/* QR Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">QR Code Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as QRType)}
              >
                {QR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Input Form */}
            <div className="mb-6">
              {renderDataForm()}
            </div>


            {/* Customization */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Customization</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Foreground Color</label>
                  <input
                    type="color"
                    className="w-full h-10 border rounded-md"
                    value={style.foregroundColor}
                    onChange={(e) => handleStyleChange('foregroundColor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <input
                    type="color"
                    className="w-full h-10 border rounded-md"
                    value={style.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Size (px)</label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="8"
                    className="w-full"
                    value={style.size}
                    onChange={(e) => handleStyleChange('size', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">{style.size}px</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Margin</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    className="w-full"
                    value={style.margin}
                    onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                  />
                  <span className="text-xs text-gray-500">{style.margin}</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate QR Code</span>
              )}
            </button>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            
            {qrImageUrl ? (
              <div className="text-center">
                <div className="inline-block p-6 bg-white border rounded-xl shadow-sm">
                  <img 
                    src={qrImageUrl}
                    alt="Generated QR Code"
                    className="mx-auto rounded-lg"
                    style={{ width: style.size, height: style.size }}
                  />
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={downloadQR}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download size={18} />
                    <span>Download PNG</span>
                  </button>
                  
                  <button
                    onClick={copyQRData}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Copy size={18} />
                    <span>Copy Image</span>
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                  <h4 className="font-medium text-gray-900 mb-2">QR Code Details</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Type:</strong> {selectedType}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Content:</strong> {formatQRContent().substring(0, 100)}{formatQRContent().length > 100 ? '...' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {style.size} x {style.size} pixels
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-lg font-medium text-gray-600">QR Code will appear here</p>
                    <p className="text-sm text-gray-500 mt-2">Fill in the details and click Generate</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
