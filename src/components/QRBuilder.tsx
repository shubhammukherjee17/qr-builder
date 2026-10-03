'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { QRType, QRCodeStyle } from '@/types'
import { renderQRCodeToCanvas } from '@/lib/qr-renderer'
import QRCode from 'qrcode'
import {
  Globe, Type, Mail, Phone, Wifi, Contact, MapPin,
  Download, Copy, Check, ChevronDown, Upload, FileText,
  Sparkles, X, Trash2, Eye, EyeOff, ArrowRight, RefreshCw,
  Share2, Utensils, Smartphone, MoreHorizontal, Undo2,
  Redo2, Square, Circle, Dot, Palette, Sliders, Layers,
  ExternalLink, SmartphoneCharging, Compass
} from 'lucide-react'
import {
  DoodleCrown, DoodleArrow, WashiTape,
  RetroStamp, PaperClip, SparkleIcon
} from '@/components/CollageDecorations'

export interface ExtendedQRTypeItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  qrType: QRType
  placeholder: string
  description?: string
}

const EXTENDED_TYPES: ExtendedQRTypeItem[] = [
  { id: 'website', label: 'Website', icon: Globe, qrType: QRType.URL, placeholder: 'https://qraft.io', description: 'Enter the website URL you want to link to.' },
  { id: 'text', label: 'Text', icon: Type, qrType: QRType.TEXT, placeholder: 'Type your message or notes...', description: 'Share plain text, secret notes, or quotes.' },
  { id: 'email', label: 'Email', icon: Mail, qrType: QRType.EMAIL, placeholder: 'contact@brand.com', description: 'Open pre-filled email to recipient.' },
  { id: 'phone', label: 'Phone', icon: Phone, qrType: QRType.PHONE, placeholder: '+1 (555) 000-0000', description: 'Prompt user to dial this phone number.' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, qrType: QRType.WIFI, placeholder: 'Network name (SSID)', description: 'Connect directly to your Wi-Fi network.' },
  { id: 'location', label: 'Location', icon: MapPin, qrType: QRType.MAPS, placeholder: 'https://maps.google.com/?q=...', description: 'Open Google Maps or coordinates.' },
  { id: 'vcard', label: 'vCard', icon: Contact, qrType: QRType.VCARD, placeholder: 'Alex Morgan', description: 'Share full contact info into address book.' },
  { id: 'social', label: 'Social Media', icon: Share2, qrType: QRType.URL, placeholder: 'https://instagram.com/yourbrand', description: 'Link to Instagram, TikTok, LinkedIn, etc.' },
  { id: 'pdf', label: 'PDF', icon: FileText, qrType: QRType.URL, placeholder: 'https://example.com/brochure.pdf', description: 'Direct link to download or view a PDF.' },
  { id: 'app', label: 'App Download', icon: Smartphone, qrType: QRType.URL, placeholder: 'https://apps.apple.com/app/id...', description: 'Link to iOS App Store or Google Play.' },
  { id: 'menu', label: 'Menu', icon: Utensils, qrType: QRType.URL, placeholder: 'https://restaurant.com/menu', description: 'Digital contactless restaurant menu.' },
  { id: 'more', label: 'More', icon: MoreHorizontal, qrType: QRType.TEXT, placeholder: 'Custom data or link...', description: 'Custom link, payload or text.' },
]

const COLOR_SWATCHES = [
  { hex: '#7c3aed', name: 'Purple' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f43f5e', name: 'Rose' },
  { hex: '#f97316', name: 'Orange' },
  { hex: '#eab308', name: 'Amber' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#2563eb', name: 'Blue' },
  { hex: '#0f172a', name: 'Navy' },
]

const DEFAULT_STYLE: QRCodeStyle = {
  foregroundColor: '#7c3aed',
  backgroundColor: '#ffffff',
  size: 512,
  margin: 2,
  errorCorrectionLevel: 'M',
  dotStyle: 'rounded',
  cornerStyle: 'rounded',
  gradientType: 'none',
  pattern: 'default',
}

export default function QRBuilder() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // State
  const [activeTypeId, setActiveTypeId] = useState<string>('website')
  const [styleTab, setStyleTab] = useState<'style' | 'frame' | 'logo' | 'colors'>('style')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDynamic, setIsDynamic] = useState(false)

  // QR Content State
  const [qrData, setQrData] = useState<Record<string, string | boolean>>({
    url: 'https://qraft.io',
    name: 'My Website',
    frameText: 'Scan to visit My Website',
    text: '',
    email: '',
    subject: '',
    body: '',
    phone: '',
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false,
    mapLink: '',
    organization: '',
    website: '',
  })

  // Style State
  const [style, setStyle] = useState<QRCodeStyle>(DEFAULT_STYLE)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  // Export State
  const [qrImageUrl, setQrImageUrl] = useState<string>('')
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'pdf'>('png')
  const [copied, setCopied] = useState(false)
  const [showWifiPassword, setShowWifiPassword] = useState(false)
  const [isRendering, setIsRendering] = useState(false)

  const activeTypeItem = EXTENDED_TYPES.find(t => t.id === activeTypeId) || EXTENDED_TYPES[0]

  const handleDataChange = (key: string, value: string | boolean) => {
    setQrData(prev => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (key: keyof QRCodeStyle, value: string | number) => {
    setStyle(prev => ({ ...prev, [key]: value }))
  }

  // Format QR content for canvas encoding
  const formatQRContent = useCallback((): string => {
    const toString = (val: unknown): string => (typeof val === 'string' ? val : val ? 'true' : '')

    switch (activeTypeId) {
      case 'website':
      case 'social':
      case 'pdf':
      case 'app':
      case 'menu': {
        const url = toString(qrData.url).trim()
        if (!url) return 'https://qraft.io'
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
      }
      case 'text':
      case 'more': {
        const text = toString(qrData.text).trim()
        return text || 'Welcome to Qraft Studio'
      }
      case 'email': {
        const email = toString(qrData.email).trim() || 'hello@example.com'
        const parts = [`mailto:${email}`]
        const subject = toString(qrData.subject)
        const body = toString(qrData.body)
        if (subject) parts.push(`subject=${encodeURIComponent(subject)}`)
        if (body) parts.push(`body=${encodeURIComponent(body)}`)
        return parts.join(parts.length > 1 ? '?' : '') + (parts.length > 2 ? parts.slice(2).join('&') : '')
      }
      case 'phone':
        return `tel:${toString(qrData.phone).trim() || '+1234567890'}`
      case 'wifi': {
        const ssid = toString(qrData.ssid) || 'OfficeWiFi'
        const pass = toString(qrData.password)
        const sec = toString(qrData.security) || 'WPA'
        const hidden = Boolean(qrData.hidden)
        return `WIFI:T:${sec};S:${ssid};P:${pass};H:${hidden ? 'true' : 'false'};;`
      }
      case 'vcard': {
        const name = toString(qrData.name) || 'Alex Morgan'
        const org = toString(qrData.organization)
        const phone = toString(qrData.phone)
        const email = toString(qrData.email)
        const website = toString(qrData.website)
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${name}`,
          org ? `ORG:${org}` : '',
          phone ? `TEL:${phone}` : '',
          email ? `EMAIL:${email}` : '',
          website ? `URL:${website}` : '',
          'END:VCARD',
        ].filter(Boolean).join('\n')
      }
      case 'location': {
        return toString(qrData.mapLink) || 'https://maps.google.com'
      }
      default:
        return toString(qrData.url) || 'https://qraft.io'
    }
  }, [qrData, activeTypeId])

  // Canvas rendering
  const renderCode = useCallback(async () => {
    if (!canvasRef.current) return
    setIsRendering(true)
    const content = formatQRContent()
    try {
      await renderQRCodeToCanvas({
        content,
        style,
        canvas: canvasRef.current,
        logoImage,
      })
      const dataUrl = canvasRef.current.toDataURL('image/png')
      setQrImageUrl(dataUrl)
    } catch (err) {
      console.error('Render error:', err)
    } finally {
      setIsRendering(false)
    }
  }, [formatQRContent, style, logoImage])

  useEffect(() => {
    const timer = setTimeout(() => {
      void renderCode()
    }, 40)
    return () => clearTimeout(timer)
  }, [renderCode])

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setLogoImage(img)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Export handlers
  const handleDownload = async () => {
    const content = formatQRContent()
    const filename = `qraft_${activeTypeId}_${Date.now()}`

    if (downloadFormat === 'png') {
      if (!canvasRef.current) return
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    } else if (downloadFormat === 'svg') {
      try {
        const svgString = await QRCode.toString(content, {
          type: 'svg',
          errorCorrectionLevel: style.errorCorrectionLevel || 'M',
          margin: style.margin,
          color: {
            dark: style.foregroundColor,
            light: style.backgroundColor,
          },
        })
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `${filename}.svg`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('SVG Export error:', err)
      }
    } else if (downloadFormat === 'pdf') {
      if (!canvasRef.current) return
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const imgData = canvasRef.current.toDataURL('image/png')
      pdf.setFontSize(16)
      pdf.text(String(qrData.name || 'Qraft QR Code'), 105, 35, { align: 'center' })
      pdf.addImage(imgData, 'PNG', 55, 45, 100, 100)
      pdf.setFontSize(10)
      pdf.setTextColor(100)
      pdf.text(String(qrData.frameText || 'Scan to view'), 105, 155, { align: 'center' })
      pdf.save(`${filename}.pdf`)
    }
  }

  const handleCopy = async () => {
    if (!canvasRef.current) return
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {
      await navigator.clipboard.writeText(formatQRContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full relative">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── MAXIMALIST WORKBENCH OUTER SHELL ──────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-maximalist-lg sm:shadow-maximalist-xl relative overflow-hidden transition-all">
        
        {/* Washi Tape Corner Accents */}
        <WashiTape color="pink" className="absolute -top-2.5 -left-3 -rotate-6 z-30 hidden sm:block" />
        <WashiTape color="cyan" className="absolute -top-2.5 -right-3 rotate-3 z-30 hidden sm:block" />
        <WashiTape color="yellow" className="absolute -bottom-2.5 right-12 rotate-[-2deg] z-30 hidden md:block" />

        {/* ── TOP HEADER / TOOLBAR ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-900/10 bg-[#faf6ee]/90">
          
          {/* Brand & Live status beacon */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                LIVE QR STUDIO
              </h3>
              <DoodleCrown className="w-4 h-3 inline-block -rotate-6 hidden xs:inline" />
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider border border-purple-200">
              Real-Time
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            
            {/* Undo / Reset button */}
            <button
              onClick={() => {
                setStyle(DEFAULT_STYLE)
                setLogoImage(null)
              }}
              title="Reset Style"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 border border-slate-200 transition-colors cursor-pointer"
            >
              <Undo2 className="h-4 w-4" />
            </button>

            {/* Refresh render */}
            <button
              onClick={() => void renderCode()}
              title="Refresh Render"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 border border-slate-200 transition-colors cursor-pointer"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            {/* Format toggle (PNG, SVG, PDF) */}
            <div className="flex bg-slate-200/90 p-0.5 rounded-xl text-xs font-bold border border-slate-300/80">
              {(['png', 'svg', 'pdf'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setDownloadFormat(fmt)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg uppercase text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                    downloadFormat === fmt
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Quick Download Header CTA */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <span>Download</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>

        </div>

        {/* ── MOBILE-FRIENDLY QUICK PREVIEW BAR (VISIBLE ON MOBILE ONLY) ── */}
        <div className="block lg:hidden bg-purple-50/80 border-b border-purple-200/70 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mini QR thumb */}
              <div className="h-12 w-12 rounded-xl bg-white p-1 border-2 border-purple-300 shrink-0 shadow-xs flex items-center justify-center">
                {qrImageUrl ? (
                  <img src={qrImageUrl} alt="QR Thumbnail" className="h-10 w-10 object-contain" />
                ) : (
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                )}
              </div>
              <div className="truncate">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">Live Preview</span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {String(qrData.frameText || 'Scan to visit My Website')}
                </p>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                title="Copy QR Code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{downloadFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 3-COLUMN WORKBENCH (FULL DESKTOP / ADAPTIVE MOBILE) ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
          
          {/* ── COLUMN 1: SELECT PAYLOAD (12 TYPES) ─────────────────── */}
          <div className="lg:col-span-3 p-4 sm:p-5 bg-[#faf8f4]/60">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                SELECT PAYLOAD
              </p>
              <span className="text-[10px] font-extrabold text-purple-700 font-mono">
                12 TYPES
              </span>
            </div>

            {/* Responsive Payload Grid: 3 cols on mobile, 4 on tablet, 1 vertical list on desktop */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-1 gap-1.5 sm:gap-2">
              {EXTENDED_TYPES.map((t) => {
                const Icon = t.icon
                const isSelected = activeTypeId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTypeId(t.id)}
                    className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                      isSelected
                        ? 'bg-[#7c3aed] text-white border-[#6d28d9] shadow-sm font-extrabold'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:bg-purple-50/50 hover:border-purple-200 hover:text-purple-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-yellow-300' : 'text-slate-400'}`} />
                    <span className="truncate">{t.label}</span>
                    {isSelected && (
                      <span className="hidden lg:inline-block ml-auto text-[10px] font-handwriting font-bold text-yellow-200">
                        active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── COLUMN 2: PAYLOAD DETAILS / INPUT FORMS ─────────────── */}
          <div className="lg:col-span-5 p-4 sm:p-6 space-y-5 bg-white">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>{activeTypeItem.label}</span>
                  <span className="text-xs font-normal text-slate-400">Settings</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {activeTypeItem.description || `Enter the details you want to link to.`}
                </p>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-handwriting font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full rotate-[-2deg]">
                Live Auto-Sync ✨
              </span>
            </div>

            {/* Input Forms */}
            {(activeTypeId === 'website' || activeTypeId === 'social' || activeTypeId === 'pdf' || activeTypeId === 'app' || activeTypeId === 'menu') && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    URL Destination <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder={activeTypeItem.placeholder}
                    value={String(qrData.url || '')}
                    onChange={(e) => handleDataChange('url', e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-white border-2 border-slate-900/20 rounded-xl text-sm sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Name / Title <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My Website"
                    value={String(qrData.name || '')}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-white border-2 border-slate-900/20 rounded-xl text-sm sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Plain Text & Notes */}
            {(activeTypeId === 'text' || activeTypeId === 'more') && (
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">Message / Plain Text</label>
                <textarea
                  rows={4}
                  placeholder={activeTypeItem.placeholder}
                  value={String(qrData.text || '')}
                  onChange={(e) => handleDataChange('text', e.target.value)}
                  className="w-full p-3 bg-white border-2 border-slate-900/20 rounded-xl text-sm sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"
                />
              </div>
            )}

            {/* Wi-Fi Details */}
            {activeTypeId === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    placeholder="e.g. Studio_5G"
                    value={String(qrData.ssid || '')}
                    onChange={(e) => handleDataChange('ssid', e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-white border-2 border-slate-900/20 rounded-xl text-sm sm:text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Wi-Fi Password</label>
                  <div className="relative">
                    <input
                      type={showWifiPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={String(qrData.password || '')}
                      onChange={(e) => handleDataChange('password', e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 bg-white border-2 border-slate-900/20 rounded-xl text-sm sm:text-xs text-slate-900 outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showWifiPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact vCard */}
            {activeTypeId === 'vcard' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={String(qrData.name || '')}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={String(qrData.phone || '')}
                    onChange={(e) => handleDataChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={String(qrData.email || '')}
                    onChange={(e) => handleDataChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Email Form */}
            {activeTypeId === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="hello@company.com"
                    value={String(qrData.email || '')}
                    onChange={(e) => handleDataChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry from QR"
                    value={String(qrData.subject || '')}
                    onChange={(e) => handleDataChange('subject', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Phone Form */}
            {activeTypeId === 'phone' && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={String(qrData.phone || '')}
                  onChange={(e) => handleDataChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                />
              </div>
            )}

            {/* Location Form */}
            {activeTypeId === 'location' && (
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Google Maps Link or Coordinates</label>
                <input
                  type="text"
                  placeholder="https://maps.google.com/?q=..."
                  value={String(qrData.mapLink || '')}
                  onChange={(e) => handleDataChange('mapLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-900/20 rounded-xl text-xs text-slate-900 outline-none focus:border-purple-600"
                />
              </div>
            )}

            {/* Dynamic QR Toggle Box */}
            <div className="p-3 sm:p-3.5 bg-purple-50/80 rounded-2xl border-2 border-purple-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-xl bg-purple-200 text-purple-800 grid place-items-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <span>Make it dynamic</span>
                    <span>✨</span>
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Edit destination URL anytime without reprinting.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDynamic(!isDynamic)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  isDynamic ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    isDynamic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Advanced Options Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-bold text-slate-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Advanced options</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Error Correction Level
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['L', 'M', 'Q', 'H'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleStyleChange('errorCorrectionLevel', lvl)}
                          className={`py-1.5 rounded-lg font-bold border text-center transition-all ${
                            style.errorCorrectionLevel === lvl
                              ? 'bg-purple-600 text-white border-purple-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Quiet Zone Margin</label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={style.margin}
                        onChange={(e) => handleStyleChange('margin', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Resolution Size</label>
                      <input
                        type="number"
                        min={256}
                        max={1024}
                        step={64}
                        value={style.size}
                        onChange={(e) => handleStyleChange('size', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── COLUMN 3: CUSTOMIZATION & LIVE PREVIEW STAGE ─────────── */}
          <div className="lg:col-span-4 p-4 sm:p-6 bg-[#faf8f4]/60 space-y-5 flex flex-col justify-between">
            
            {/* Customization Tabs */}
            <div className="space-y-4">
              
              <div className="flex bg-slate-200/90 p-1 rounded-2xl text-xs font-bold border border-slate-300/80">
                {(['style', 'frame', 'logo', 'colors'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStyleTab(tab)}
                    className={`flex-1 py-1.5 rounded-xl capitalize text-center transition-all cursor-pointer ${
                      styleTab === tab
                        ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Subtab: Style (Pattern & Corners) - DESIGNED TO NEVER TRUNCATE! */}
              {styleTab === 'style' && (
                <div className="space-y-3.5">
                  {/* Pattern */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      PATTERN
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'square', label: 'Square', icon: Square },
                        { id: 'rounded', label: 'Rounded', icon: Circle },
                        { id: 'dots', label: 'Dots', icon: Dot },
                      ].map(p => {
                        const Icon = p.icon
                        const isSelected = style.dotStyle === p.id
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleStyleChange('dotStyle', p.id as 'square' | 'rounded' | 'dots')}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50 text-purple-700 font-extrabold ring-1 ring-purple-600'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="h-4 w-4 mb-0.5 shrink-0" />
                            <span className="text-[11px] leading-tight font-bold whitespace-nowrap">{p.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Corners */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      CORNERS
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'square', label: 'Square' },
                        { id: 'rounded', label: 'Rounded' },
                        { id: 'extra-rounded', label: 'Circle' },
                      ].map(c => {
                        const isSelected = style.cornerStyle === c.id
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleStyleChange('cornerStyle', c.id as 'square' | 'rounded' | 'extra-rounded')}
                            className={`py-2 px-1 rounded-xl border-2 text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50 text-purple-700 font-extrabold ring-1 ring-purple-600'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-[11px] leading-tight font-bold whitespace-nowrap block">{c.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab: Colors */}
              {(styleTab === 'colors' || styleTab === 'style') && (
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-2">
                    COLORS
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_SWATCHES.map(color => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleStyleChange('foregroundColor', color.hex)}
                        title={color.name}
                        className={`h-7 w-7 rounded-full border border-black/15 transition-transform cursor-pointer shrink-0 ${
                          style.foregroundColor === color.hex
                            ? 'scale-125 ring-2 ring-purple-600 ring-offset-2'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                    {/* Custom Hex input */}
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-[10px] font-bold text-slate-400">#</span>
                      <input
                        type="text"
                        value={style.foregroundColor.replace('#', '')}
                        onChange={(e) => handleStyleChange('foregroundColor', `#${e.target.value}`)}
                        className="w-16 px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase text-slate-800"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab: Frame */}
              {styleTab === 'frame' && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                    FRAME LABEL TEXT
                  </label>
                  <input
                    type="text"
                    placeholder="Scan to visit My Website"
                    value={String(qrData.frameText || '')}
                    onChange={(e) => handleDataChange('frameText', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border-2 border-slate-900/20 rounded-xl text-xs outline-none focus:border-purple-600"
                  />
                  <p className="text-[10px] text-slate-400">
                    Displayed directly below the live QR code on the framed export.
                  </p>
                </div>
              )}

              {/* Subtab: Logo */}
              {styleTab === 'logo' && (
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                    CENTER LOGO
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border-2 border-dashed border-purple-300 hover:border-purple-600 rounded-xl text-xs font-bold text-purple-700 bg-white cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{logoImage ? 'Replace Logo' : 'Upload PNG / SVG Logo'}</span>
                    </button>
                    {logoImage && (
                      <button
                        type="button"
                        onClick={() => setLogoImage(null)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 text-xs cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* ── POLAROID-STYLE LIVE QR PREVIEW CARD (MAXIMALIST) ─────── */}
            <div className="pt-2">
              <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-maximalist border-2 border-slate-900 text-center relative mx-auto max-w-[260px] sm:max-w-[280px]">
                
                {/* Washi tape pinning the card */}
                <WashiTape color="yellow" className="absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-[-2deg] z-10 w-20" />

                {/* QR Code Canvas container */}
                <div
                  className="p-3 sm:p-4 rounded-2xl mx-auto flex items-center justify-center transition-all mt-1"
                  style={{ backgroundColor: style.backgroundColor }}
                >
                  {qrImageUrl ? (
                    <img
                      src={qrImageUrl}
                      alt="Live Generated QR Code"
                      className="mx-auto rounded-lg max-w-[170px] sm:max-w-[190px] h-auto object-contain"
                    />
                  ) : (
                    <div className="h-40 w-40 flex items-center justify-center text-slate-300">
                      <RefreshCw className="h-7 w-7 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Frame Text Underneath */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {String(qrData.frameText || 'Scan to visit My Website')}
                  </p>
                  <p className="text-[10px] font-handwriting font-bold text-purple-700 mt-0.5 truncate">
                    Point camera to scan instantly ✦
                  </p>
                </div>

              </div>

              {/* Action Buttons: Copy to Clipboard & Mobile Download */}
              <div className="mt-4 space-y-2 max-w-[260px] sm:max-w-[280px] mx-auto">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-2xl border-2 border-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600 stroke-[3]" /> : <Copy className="h-4 w-4 text-slate-500" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3 px-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-maximalist flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Download {downloadFormat.toUpperCase()}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}