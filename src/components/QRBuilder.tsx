'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { QRType, QRCodeStyle, MapProvider } from '@/types'
import { MAP_PROVIDERS, formatMapsUrl, validateMapsInput, isMapLink, parseMapLink } from '@/lib/maps-utils'
import { renderQRCodeToCanvas } from '@/lib/qr-renderer'
import { STYLE_PRESETS } from '@/lib/qr-presets'
import { dbOperations, type QRCodeRecord } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import QRCode from 'qrcode'
import {
  Globe, Type, Mail, Phone, MessageSquare, Wifi, Contact, MapPin,
  Download, Copy, Check, ChevronDown, Upload, FileText, Image as ImageIcon,
  Sparkles, History as HistoryIcon, X, Trash2, Eye, EyeOff,
  Palette, Sliders, ShieldCheck, FileSpreadsheet, ArrowRight, RefreshCw,
  Share2, Utensils, Smartphone, MoreHorizontal, Undo2, Redo2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ExtendedQRTypeItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  qrType: QRType
  placeholder: string
  description?: string
}

const EXTENDED_TYPES: ExtendedQRTypeItem[] = [
  { id: 'website', label: 'Website', icon: Globe, qrType: QRType.URL, placeholder: 'https://example.com' },
  { id: 'text', label: 'Text', icon: Type, qrType: QRType.TEXT, placeholder: 'Share a message, notes or quote...' },
  { id: 'email', label: 'Email', icon: Mail, qrType: QRType.EMAIL, placeholder: 'contact@brand.com' },
  { id: 'phone', label: 'Phone', icon: Phone, qrType: QRType.PHONE, placeholder: '+1 (555) 000-0000' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, qrType: QRType.WIFI, placeholder: 'Network name (SSID)' },
  { id: 'location', label: 'Location', icon: MapPin, qrType: QRType.MAPS, placeholder: 'Google Maps link or address' },
  { id: 'vcard', label: 'vCard', icon: Contact, qrType: QRType.VCARD, placeholder: 'Full Name' },
  { id: 'social', label: 'Social Media', icon: Share2, qrType: QRType.URL, placeholder: 'https://instagram.com/yourhandle' },
  { id: 'pdf', label: 'PDF', icon: FileText, qrType: QRType.URL, placeholder: 'https://example.com/document.pdf' },
  { id: 'app', label: 'App Download', icon: Smartphone, qrType: QRType.URL, placeholder: 'https://apps.apple.com/app/id12345' },
  { id: 'menu', label: 'Menu', icon: Utensils, qrType: QRType.URL, placeholder: 'https://restaurant.com/menu' },
  { id: 'more', label: 'More', icon: MoreHorizontal, qrType: QRType.TEXT, placeholder: 'Custom payload...' },
]

const COLOR_SWATCHES = [
  '#7c3aed', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#2563eb', // Blue
  '#0f172a', // Navy / Dark
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
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Navigation & Subtabs
  const [activeTab, setActiveTab] = useState<'studio' | 'batch'>('studio')
  const [activeTypeId, setActiveTypeId] = useState<string>('website')
  const [styleTab, setStyleTab] = useState<'style' | 'frame' | 'logo' | 'colors'>('style')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDynamic, setIsDynamic] = useState(false)

  // QR Content State
  const [qrData, setQrData] = useState<Record<string, string | boolean>>({
    url: 'https://qraft.io',
    name: 'My Website',
    frameText: 'Scan to visit My Website',
  })

  // Style State
  const [style, setStyle] = useState<QRCodeStyle>(DEFAULT_STYLE)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)
  const [frameEnabled, setFrameEnabled] = useState(true)

  // Export & UI State
  const [qrImageUrl, setQrImageUrl] = useState<string>('')
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'pdf'>('png')
  const [copied, setCopied] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showWifiPassword, setShowWifiPassword] = useState(false)
  const [recentQRCodes, setRecentQRCodes] = useState<QRCodeRecord[]>([])
  
  // Batch State
  const [batchRows, setBatchRows] = useState<Array<{ type: string; content: string; status?: string }>>([])
  const [isProcessingBatch, setIsProcessingBatch] = useState(false)

  const activeTypeItem = EXTENDED_TYPES.find(t => t.id === activeTypeId) || EXTENDED_TYPES[0]
  const selectedType = activeTypeItem.qrType

  // Data change
  const handleDataChange = (key: string, value: string | boolean) => {
    setQrData(prev => ({ ...prev, [key]: value }))
  }

  const handleStyleChange = (key: keyof QRCodeStyle, value: string | number) => {
    setStyle(prev => ({ ...prev, [key]: value }))
  }

  // Format QR content for encoding
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
        if (isMapLink(url)) {
          const parsed = parseMapLink(url)
          return parsed.valid ? formatMapsUrl({ locationMode: 'link', mapLink: url, mapProvider: MapProvider.GOOGLE }) : url
        }
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
        const note = toString(qrData.note)
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${name}`,
          org ? `ORG:${org}` : '',
          phone ? `TEL:${phone}` : '',
          email ? `EMAIL:${email}` : '',
          website ? `URL:${website}` : '',
          note ? `NOTE:${note}` : '',
          'END:VCARD',
        ].filter(Boolean).join('\n')
      }
      case 'location': {
        const link = toString(qrData.mapLink) || 'https://maps.google.com'
        return link
      }
      default:
        return toString(qrData.url) || 'https://qraft.io'
    }
  }, [qrData, activeTypeId])

  // Canvas rendering
  const renderCode = useCallback(async () => {
    if (!canvasRef.current) return
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

  // Download export
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
      // Fallback: copy content string
      await navigator.clipboard.writeText(formatQRContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── MAIN STUDIO WORKBENCH (3 COLUMNS) ────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Top Header bar with Undo/Redo & Download */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live QR Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStyle(DEFAULT_STYLE)
                setLogoImage(null)
              }}
              title="Reset Style"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => void renderCode()}
              title="Refresh Render"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <Redo2 className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Format toggle */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
              {(['png', 'svg', 'pdf'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setDownloadFormat(fmt)}
                  className={`px-2 py-1 rounded uppercase transition-all ${
                    downloadFormat === fmt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Download CTA */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0f172a] hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Download</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 3-Column Studio Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* ── 1. TYPE SELECTOR SIDEBAR (3 cols) ────────────────────── */}
          <div className="md:col-span-3 p-4 bg-slate-50/40">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Select Payload
            </p>
            <div className="space-y-1">
              {EXTENDED_TYPES.map((t) => {
                const Icon = t.icon
                const isSelected = activeTypeId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTypeId(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#ede9fe] text-[#6d28d9] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#6d28d9]' : 'text-slate-400'}`} />
                    <span className="truncate">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 2. CONTENT FORM (5 cols) ─────────────────────────────── */}
          <div className="md:col-span-5 p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">{activeTypeItem.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTypeItem.description || `Enter the ${activeTypeItem.label.toLowerCase()} details you want to link to.`}
              </p>
            </div>

            {/* URL & Common Links */}
            {(activeTypeId === 'website' || activeTypeId === 'social' || activeTypeId === 'pdf' || activeTypeId === 'app' || activeTypeId === 'menu') && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL</label>
                  <input
                    type="url"
                    placeholder={activeTypeItem.placeholder}
                    value={String(qrData.url || '')}
                    onChange={(e) => handleDataChange('url', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. My Website"
                    value={String(qrData.name || '')}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Plain Text */}
            {(activeTypeId === 'text' || activeTypeId === 'more') && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Message / Text</label>
                <textarea
                  rows={4}
                  placeholder={activeTypeItem.placeholder}
                  value={String(qrData.text || '')}
                  onChange={(e) => handleDataChange('text', e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"
                />
              </div>
            )}

            {/* Wi-Fi Form */}
            {activeTypeId === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    placeholder="Office_Guest"
                    value={String(qrData.ssid || '')}
                    onChange={(e) => handleDataChange('ssid', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showWifiPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={String(qrData.password || '')}
                      onChange={(e) => handleDataChange('password', e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showWifiPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact vCard Form */}
            {activeTypeId === 'vcard' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={String(qrData.name || '')}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={String(qrData.phone || '')}
                    onChange={(e) => handleDataChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={String(qrData.email || '')}
                    onChange={(e) => handleDataChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Form */}
            {activeTypeId === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="hello@company.com"
                    value={String(qrData.email || '')}
                    onChange={(e) => handleDataChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry"
                    value={String(qrData.subject || '')}
                    onChange={(e) => handleDataChange('subject', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Phone Form */}
            {activeTypeId === 'phone' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={String(qrData.phone || '')}
                  onChange={(e) => handleDataChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>
            )}

            {/* Location Form */}
            {activeTypeId === 'location' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location or Maps Link</label>
                <input
                  type="text"
                  placeholder="https://maps.app.goo.gl/... or coordinates"
                  value={String(qrData.mapLink || '')}
                  onChange={(e) => handleDataChange('mapLink', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>
            )}

            {/* Dynamic QR Toggle */}
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-purple-100 text-purple-700 grid place-items-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>Make it dynamic</span>
                    <span className="text-amber-500">✨</span>
                  </p>
                  <p className="text-[10px] text-slate-500">Edit this URL anytime without reprinting.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDynamic(!isDynamic)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  isDynamic ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isDynamic ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Advanced Options accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <span>Advanced options</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Frame Title Text</label>
                    <input
                      type="text"
                      value={String(qrData.frameText || '')}
                      onChange={(e) => handleDataChange('frameText', e.target.value)}
                      placeholder="Scan to visit"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Error Correction Level</label>
                    <div className="flex gap-1.5">
                      {(['L', 'M', 'Q', 'H'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleStyleChange('errorCorrectionLevel', lvl)}
                          className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all ${
                            style.errorCorrectionLevel === lvl ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── 3. LIVE PREVIEW & DESIGN CONTROLS (4 cols) ──────────── */}
          <div className="md:col-span-4 p-5 bg-slate-50/30 flex flex-col justify-between space-y-4">
            
            {/* Style Subtabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              {(['style', 'frame', 'logo', 'colors'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStyleTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                    styleTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Style (Pattern & Corners) */}
            {styleTab === 'style' && (
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pattern</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'square', label: 'Square' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'dots', label: 'Dots' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleStyleChange('dotStyle', p.id as 'square' | 'rounded' | 'dots')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          style.dotStyle === p.id
                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] block truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Corners</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'square', label: 'Square' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'extra-rounded', label: 'Circle' },
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleStyleChange('cornerStyle', c.id as 'square' | 'rounded' | 'extra-rounded')}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          style.cornerStyle === c.id
                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] block truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Colors */}
            {(styleTab === 'colors' || styleTab === 'style') && (
              <div>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Colors</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={color}
                      onClick={() => handleStyleChange('foregroundColor', color)}
                      className={`h-6 w-6 rounded-full border border-black/10 transition-transform cursor-pointer ${
                        style.foregroundColor === color ? 'scale-125 ring-2 ring-purple-600 ring-offset-1' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Frame */}
            {styleTab === 'frame' && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Frame Label</p>
                <input
                  type="text"
                  placeholder="Scan to visit"
                  value={String(qrData.frameText || '')}
                  onChange={(e) => handleDataChange('frameText', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
            )}

            {/* Tab: Logo */}
            {styleTab === 'logo' && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Center Logo</p>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-slate-300 hover:border-purple-500 rounded-xl text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-purple-600" />
                    <span>{logoImage ? 'Change Logo' : 'Upload Logo'}</span>
                  </button>

                  {logoImage && (
                    <button
                      onClick={() => setLogoImage(null)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                      title="Remove Logo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── THE LIVE QR PREVIEW CARD (MATCHING REFERENCE IMAGE) ── */}
            <div className="py-2 flex items-center justify-center">
              <div className="w-full max-w-[220px] bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-center">
                <div className="p-2 bg-white rounded-xl mx-auto flex items-center justify-center">
                  {qrImageUrl ? (
                    <img
                      src={qrImageUrl}
                      alt="Generated QR Code"
                      className="mx-auto rounded-lg max-w-[150px] h-auto object-contain"
                    />
                  ) : (
                    <div className="h-36 w-36 flex items-center justify-center text-slate-300">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Frame Text label underneath code */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {String(qrData.frameText || 'Scan to visit')}
                  </p>
                </div>
              </div>
            </div>

            {/* Copy button */}
            <div className="pt-2">
              <button
                onClick={handleCopy}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}