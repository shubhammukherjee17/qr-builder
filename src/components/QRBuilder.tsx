'use client'

import { useState, useRef } from 'react'
import { QRType, QRCodeStyle } from '@/types'
import { Download, Copy, RefreshCw, Check, ChevronDown } from 'lucide-react'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'

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
        
        // Scroll to preview section after a short delay to allow the image to render
        setTimeout(() => {
          const previewSection = document.querySelector('[data-qr-preview]')
          if (previewSection) {
            previewSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }, 200)
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
    const inputClassName = "w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
    const labelClassName = "block text-sm font-medium text-gray-700 mb-2"

    switch (selectedType) {
      case QRType.TEXT:
        return (
          <div>
            <label className={labelClassName}>Text Content</label>
            <textarea
              className={`${inputClassName} resize-none`}
              rows={4}
              placeholder="Enter your text here..."
              value={String(qrData.text || '')}
              onChange={(e) => handleDataChange('text', e.target.value)}
            />
          </div>
        )

      case QRType.URL:
        return (
          <div>
            <label className={labelClassName}>Website URL</label>
            <input
              type="url"
              className={inputClassName}
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
              <label className={labelClassName}>Email Address</label>
              <input
                type="email"
                className={inputClassName}
                placeholder="example@email.com"
                value={String(qrData.email || '')}
                onChange={(e) => handleDataChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Subject (Optional)</label>
              <input
                type="text"
                className={inputClassName}
                placeholder="Email subject"
                value={String(qrData.subject || '')}
                onChange={(e) => handleDataChange('subject', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Message (Optional)</label>
              <textarea
                className={`${inputClassName} resize-none`}
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
            <label className={labelClassName}>Phone Number</label>
            <input
              type="tel"
              className={inputClassName}
              placeholder="+1 234 567 8900"
              value={String(qrData.phone || '')}
              onChange={(e) => handleDataChange('phone', e.target.value)}
            />
          </div>
        )

      case QRType.SMS:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Phone Number</label>
              <input
                type="tel"
                className={inputClassName}
                placeholder="+1 234 567 8900"
                value={String(qrData.phone || '')}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Message</label>
              <textarea
                className={`${inputClassName} resize-none`}
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
              <label className={labelClassName}>Network Name (SSID)</label>
              <input
                type="text"
                className={inputClassName}
                placeholder="My WiFi Network"
                value={String(qrData.ssid || '')}
                onChange={(e) => handleDataChange('ssid', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Password</label>
              <input
                type="password"
                className={inputClassName}
                placeholder="WiFi Password"
                value={String(qrData.password || '')}
                onChange={(e) => handleDataChange('password', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Security Type</label>
              <div className="relative">
                <select
                  className={`${inputClassName} appearance-none`}
                  value={String(qrData.security || 'WPA')}
                  onChange={(e) => handleDataChange('security', e.target.value)}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open Network</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="hidden"
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={Boolean(qrData.hidden)}
                onChange={(e) => handleDataChange('hidden', e.target.checked)}
              />
              <label htmlFor="hidden" className="text-sm text-gray-700">Hidden Network</label>
            </div>
          </div>
        )

      case QRType.VCARD:
        return (
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>Full Name</label>
              <input
                type="text"
                className={inputClassName}
                placeholder="John Doe"
                value={String(qrData.name || '')}
                onChange={(e) => handleDataChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Organization</label>
              <input
                type="text"
                className={inputClassName}
                placeholder="Company Name"
                value={String(qrData.organization || '')}
                onChange={(e) => handleDataChange('organization', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Phone</label>
                <input
                  type="tel"
                  className={inputClassName}
                  placeholder="+1 234 567 8900"
                  value={String(qrData.phone || '')}
                  onChange={(e) => handleDataChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  type="email"
                  className={inputClassName}
                  placeholder="john@example.com"
                  value={String(qrData.email || '')}
                  onChange={(e) => handleDataChange('email', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClassName}>Website</label>
              <input
                type="url"
                className={inputClassName}
                placeholder="https://example.com"
                value={String(qrData.website || '')}
                onChange={(e) => handleDataChange('website', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClassName}>Notes</label>
              <textarea
                className={`${inputClassName} resize-none`}
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto"
    >
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* QR Builder Form - Left Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* QR Type Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-3">QR Type</label>
              <div className="relative">
                <select
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as QRType)}
                >
                  {QR_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Data Input Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50"
            >
              {renderDataForm()}
            </motion.div>
          </AnimatePresence>

          {/* Customization */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Style</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-2">Foreground</label>
                  <div className="relative">
                    <input
                      type="color"
                      className="w-full h-12 border-2 border-gray-200 rounded-2xl cursor-pointer"
                      value={style.foregroundColor}
                      onChange={(e) => handleStyleChange('foregroundColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-2">Background</label>
                  <input
                    type="color"
                    className="w-full h-12 border-2 border-gray-200 rounded-2xl cursor-pointer"
                    value={style.backgroundColor}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Size: {style.size}px</label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="8"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    value={style.size}
                    onChange={(e) => handleStyleChange('size', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Margin: {style.margin}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    value={style.margin}
                    onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateQR}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate QR Code</span>
            )}
          </motion.button>
        </motion.div>

        {/* QR Code Preview - Right Side */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3" 
          data-qr-preview
        >
          <div className="sticky top-24">
            {qrImageUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="text-center"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block p-4 bg-white rounded-2xl shadow-lg"
                  >
                    <img 
                      src={qrImageUrl}
                      alt="Generated QR Code"
                      className="mx-auto rounded-xl"
                      style={{ width: style.size, height: style.size }}
                    />
                  </motion.div>
                  
                  <div className="flex justify-center space-x-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadQR}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download size={18} />
                      <span>Download</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyQRData}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Copy size={18} />
                      <span>Copy</span>
                    </motion.button>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-gray-50/80 backdrop-blur-sm rounded-2xl text-left border border-gray-200/50"
                  >
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      QR Code Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Type:</span> {selectedType}</p>
                      <p><span className="font-medium">Size:</span> {style.size} × {style.size}px</p>
                      <p><span className="font-medium">Content:</span> {formatQRContent().substring(0, 40)}{formatQRContent().length > 40 ? '...' : ''}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-16 border-2 border-dashed border-gray-300">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-8xl mb-6"
                  >
                    📱
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">QR Code Preview</h3>
                  <p className="text-gray-500">Fill in the details and generate your QR code</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </motion.div>
  )
}
