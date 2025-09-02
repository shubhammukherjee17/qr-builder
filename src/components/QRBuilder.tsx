'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { QRType, QRCodeStyle } from '@/types'
import { Download, Copy, RefreshCw, Check, ChevronDown } from 'lucide-react'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import { dbOperations, type QRCodeRecord, supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<QRType>(QRType.TEXT)
  const [qrData, setQrData] = useState<Record<string, string | boolean>>({})
  const [style, setStyle] = useState<QRCodeStyle>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    size: 256,
    margin: 4,
    errorCorrectionLevel: 'M',
    dotStyle: 'square',
    cornerStyle: 'square',
    gradientType: 'none',
    pattern: 'default',
  })
  const [qrImageUrl, setQrImageUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentQRCodes, setRecentQRCodes] = useState<QRCodeRecord[]>([])
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

  const fetchRecent = useCallback(async () => {
    try {
      // Only fetch user-specific QR codes if authenticated, otherwise get public ones
      const userId = user?.id
      const list = await dbOperations.getQRCodes(6, 0, userId)
      setRecentQRCodes(list || [])
    } catch (e) {
      console.warn('Failed to fetch recent QRs:', e)
    }
  }, [user?.id])

  useEffect(() => {
    fetchRecent()
  }, [user, fetchRecent])

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
          errorCorrectionLevel: style.errorCorrectionLevel
        })
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png')
        setQrImageUrl(dataUrl)

        // Persist to database (Supabase) if configured and user is authenticated
        if (supabase) {
          try {
            await dbOperations.createQRCode({
              type: selectedType,
              content,
              data: qrData as Record<string, unknown>,
              style: style as unknown as Record<string, unknown>,
              image_url: dataUrl,
            }, user?.id) // Pass user ID if authenticated
            // Refresh recent list
            fetchRecent()
          } catch (e) {
            console.warn('Failed to save QR to database:', e)
          }
        }
        
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
      className="w-full"
    >
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* QR Builder Form - Left Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4 space-y-6"
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

          {/* Customization - Colors */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Colors & Gradients</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-2">Foreground</label>
                  <input
                    type="color"
                    className="w-full h-12 border-2 border-gray-200 rounded-2xl cursor-pointer"
                    value={style.foregroundColor}
                    onChange={(e) => handleStyleChange('foregroundColor', e.target.value)}
                  />
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
              
              <div>
                <label className="block text-xs text-gray-600 mb-2">Gradient Type</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={style.gradientType}
                    onChange={(e) => handleStyleChange('gradientType', e.target.value)}
                  >
                    <option value="none">Solid Color</option>
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {style.gradientType !== 'none' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Gradient Color</label>
                  <input
                    type="color"
                    className="w-full h-12 border-2 border-gray-200 rounded-2xl cursor-pointer"
                    value={style.gradientColor || '#3b82f6'}
                    onChange={(e) => handleStyleChange('gradientColor', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Customization - Shape & Pattern */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Shape & Pattern</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Dot Style</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      value={style.dotStyle}
                      onChange={(e) => handleStyleChange('dotStyle', e.target.value)}
                    >
                      <option value="square">Square</option>
                      <option value="rounded">Rounded</option>
                      <option value="dots">Dots</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Corner Style</label>
                  <div className="relative">
                    <select
                      className="w-full p-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      value={style.cornerStyle}
                      onChange={(e) => handleStyleChange('cornerStyle', e.target.value)}
                    >
                      <option value="square">Square</option>
                      <option value="rounded">Rounded</option>
                      <option value="extra-rounded">Extra Rounded</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-2">Pattern Style</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={style.pattern}
                    onChange={(e) => handleStyleChange('pattern', e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="dots">Dots</option>
                    <option value="squares">Squares</option>
                    <option value="rounded">Rounded</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-2">Corner Radius: {style.cornerRadius || 0}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  value={style.cornerRadius || 0}
                  onChange={(e) => handleStyleChange('cornerRadius', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Customization - Size & Quality */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Size & Quality</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Error Correction</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-white border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={style.errorCorrectionLevel}
                    onChange={(e) => handleStyleChange('errorCorrectionLevel', e.target.value)}
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Higher levels can recover from more damage but create denser codes</p>
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

          {/* Logo Upload */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Logo (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Logo URL</label>
                <input
                  type="url"
                  className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                  placeholder="https://example.com/logo.png"
                  value={style.logoUrl || ''}
                  onChange={(e) => handleStyleChange('logoUrl', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Add a logo to the center of your QR code</p>
              </div>
              
              {style.logoUrl && (
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Logo Size: {style.logoSize || 40}px</label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    value={style.logoSize || 40}
                    onChange={(e) => handleStyleChange('logoSize', parseInt(e.target.value))}
                  />
                </div>
              )}
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

        {/* QR Code Preview - Center */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-4" 
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

        {/* Right Sidebar - Advanced Features */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="sticky top-24 space-y-6">
            {/* QR History */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Recent QR Codes
              </h3>
            <div className="space-y-3">
              {recentQRCodes.length === 0 && (
                <p className="text-xs text-gray-500">No recent QR codes yet.</p>
              )}
              {recentQRCodes.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl hover:bg-gray-100/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {qr.image_url ? (
                        <img src={qr.image_url} alt="qr" className="w-8 h-8 object-cover" />
                      ) : (
                        <span className="text-xs">QR</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{qr.type}</p>
                      <p className="text-xs text-gray-500">{new Date(qr.created_at || Date.now()).toLocaleString()}</p>
                    </div>
                  </div>
                  {qr.image_url && (
                    <button
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = qr.image_url as string
                        link.download = 'qr-code.png'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <Download size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button className="w-full text-center py-2 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                View all history
              </button>
            </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Quick Templates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedType(QRType.URL)
                    setQrData({ url: 'https://example.com' })
                    setStyle((s) => ({ ...s, foregroundColor: '#0f172a', backgroundColor: '#ffffff' }))
                  }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-center group">
                  <div className="text-2xl mb-2">🌐</div>
                  <p className="text-xs font-medium text-gray-700">Website</p>
                  <p className="text-xs text-gray-500">Quick URL</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedType(QRType.EMAIL)
                    setQrData({ email: 'hello@example.com', subject: 'Hello', body: 'Hi there!' })
                  }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-200 text-center group">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="text-xs font-medium text-gray-700">Email</p>
                  <p className="text-xs text-gray-500">Contact Me</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedType(QRType.WIFI)
                    setQrData({ ssid: 'MyWiFi', password: 'password123', security: 'WPA', hidden: false })
                  }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-center group">
                  <div className="text-2xl mb-2">📶</div>
                  <p className="text-xs font-medium text-gray-700">WiFi</p>
                  <p className="text-xs text-gray-500">Share Network</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedType(QRType.VCARD)
                    setQrData({ name: 'John Doe', organization: 'Company', phone: '+1 234 567 8900', email: 'john@example.com', website: 'https://example.com' })
                  }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-center group">
                  <div className="text-2xl mb-2">👤</div>
                  <p className="text-xs font-medium text-gray-700">vCard</p>
                  <p className="text-xs text-gray-500">Business Card</p>
                </button>
              </div>
            </div>

            {/* Batch Generator */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Batch Generator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Upload CSV File</label>
                  <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const text = await file.text()
                        // Simple CSV parse: type,content
                        const rows = text.split(/\r?\n/).filter(Boolean)
                        let created = 0
                        for (const row of rows) {
                          const [type, content] = row.split(',')
                          if (!type || !content) continue
                          try {
                            const dataUrl = await QRCode.toDataURL(content, {
                              width: style.size,
                              margin: style.margin,
                              color: { dark: style.foregroundColor, light: style.backgroundColor },
                              errorCorrectionLevel: style.errorCorrectionLevel
                            })
                            await dbOperations.createQRCode({
                              type: type.trim(),
                              content: content.trim(),
                              data: {},
                              style: style as unknown as Record<string, unknown>,
                              image_url: dataUrl
                            }, user?.id)
                            created++
                          } catch (err) {
                            console.warn('Failed to create QR from CSV row:', row, err)
                          }
                        }
                        alert(`Created ${created} QR codes from CSV`)
                        fetchRecent()
                      }}
                    />
                    <div className="text-2xl mb-2">📁</div>
                    <p className="text-sm text-gray-600">Drop CSV file here</p>
                    <p className="text-xs text-gray-500">or click to browse</p>
                  </label>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 text-sm">
                  Generate Batch QRs
                </button>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Export Options
              </h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    const content = formatQRContent()
                    if (!content) return alert('Generate a QR first')
                    // Lazy import jsPDF to avoid bundling cost
                    const { jsPDF } = await import('jspdf')
                    const doc = new jsPDF({ unit: 'px', format: [style.size + 64, style.size + 64] })
                    const img = qrImageUrl
                    if (!img) return alert('Generate a QR first')
                    doc.addImage(img, 'PNG', 32, 32, style.size, style.size)
                    doc.save('qr-code.pdf')
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-sm">
                  <span>📄</span>
                  <span>Export as PDF</span>
                </button>
                
                <button
                  onClick={async () => {
                    const content = formatQRContent()
                    if (!content) return alert('Generate a QR first')
                    const svgString = await QRCode.toString(content, {
                      type: 'svg',
                      width: style.size,
                      margin: style.margin,
                      color: { dark: style.foregroundColor, light: style.backgroundColor },
                      errorCorrectionLevel: style.errorCorrectionLevel
                    })
                    const blob = new Blob([svgString], { type: 'image/svg+xml' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'qr-code.svg'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-sm">
                  <span>🖼️</span>
                  <span>Export as SVG</span>
                </button>
                
                <button
                  onClick={async () => {
                    if (!qrImageUrl) return alert('Generate a QR first')
                    alert('Analytics export would include scan data from Supabase (stub).')
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-sm">
                  <span>📊</span>
                  <span>Export with Analytics</span>
                </button>
              </div>
            </div>

            {/* QR Analytics Preview */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                QR Analytics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Scans</span>
                  <span className="text-lg font-bold text-blue-600">247</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-lg font-bold text-green-600">42</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-lg font-bold text-purple-600">94%</span>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                    View detailed analytics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </motion.div>
  )
}
