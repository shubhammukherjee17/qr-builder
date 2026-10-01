'use client'

import { useState } from 'react'
import QRBuilder from '@/components/QRBuilder'
import { AuthProvider } from '@/contexts/AuthContext'
import {
  QrCode, ArrowRight, Globe, Share2, Contact, Wifi, Ticket,
  Utensils, Sparkles, Check, ChevronDown, ChevronLeft, ChevronRight,
  ShieldCheck, MapPin, Smartphone, Clock, Mail, Phone, FileText,
  MoreHorizontal, Download, Sun, Moon, Gift, UserCheck, Shield,
  Layers, Sliders, Laptop, Heart, Undo2, Redo2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const VALUE_PROPS = [
  {
    title: 'Completely Free',
    sub: 'No hidden charges',
    icon: Gift,
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'No Sign Up',
    sub: 'Create in seconds',
    icon: UserCheck,
    iconBg: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'High-Quality',
    sub: 'Print & digital ready',
    icon: Layers,
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    title: 'Fully Customizable',
    sub: 'Colors, logo, style',
    icon: Sliders,
    iconBg: 'bg-teal-50 text-teal-600',
  },
  {
    title: 'Works Everywhere',
    sub: 'Scan on any device',
    icon: Laptop,
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
]

const USE_CASES = [
  { id: 'website', title: 'Website', sub: 'Link to any URL', icon: Globe, iconBg: 'bg-purple-50 text-purple-600' },
  { id: 'text', title: 'Text', sub: 'Share a message', icon: FileText, iconBg: 'bg-amber-50 text-amber-600' },
  { id: 'email', title: 'Email', sub: 'Open email app', icon: Mail, iconBg: 'bg-indigo-50 text-indigo-600' },
  { id: 'phone', title: 'Phone', sub: 'Make a call', icon: Phone, iconBg: 'bg-emerald-50 text-emerald-600' },
  { id: 'wifi', title: 'Wi-Fi', sub: 'Share Wi-Fi instantly', icon: Wifi, iconBg: 'bg-sky-50 text-sky-600' },
  { id: 'location', title: 'Location', sub: 'Share a location', icon: MapPin, iconBg: 'bg-rose-50 text-rose-600' },
  { id: 'vcard', title: 'vCard', sub: 'Share contact details', icon: Contact, iconBg: 'bg-teal-50 text-teal-600' },
  { id: 'social', title: 'Social Media', sub: 'Link all your profiles', icon: Share2, iconBg: 'bg-blue-50 text-blue-600' },
  { id: 'pdf', title: 'PDF', sub: 'Share documents', icon: FileText, iconBg: 'bg-pink-50 text-pink-600' },
  { id: 'app', title: 'App Download', sub: 'iOS & Android', icon: Smartphone, iconBg: 'bg-emerald-50 text-emerald-600' },
  { id: 'menu', title: 'Menu', sub: 'Restaurant menu', icon: Utensils, iconBg: 'bg-amber-50 text-amber-600' },
  { id: 'more', title: 'More', sub: 'And many more', icon: MoreHorizontal, iconBg: 'bg-slate-50 text-slate-600' },
]

const TEMPLATE_CARDS = [
  {
    id: 'coffee',
    tag: 'Coffee Shop',
    title: 'The Daily Grind',
    bg: 'bg-gradient-to-b from-[#2b1b17] to-[#120b08]',
    qrFg: '#ffffff',
    qrBg: '#3d2b24',
    accent: '#d97706',
    previewType: 'latte',
  },
  {
    id: 'instagram',
    tag: 'on Instagram',
    title: 'Follow Us',
    bg: 'bg-gradient-to-b from-[#fce7f3] to-[#fbcfe8]',
    qrFg: '#be185d',
    qrBg: '#ffffff',
    accent: '#ec4899',
    previewType: 'insta',
  },
  {
    id: 'restaurant',
    tag: 'Restaurant Menu',
    title: 'THE GREEN TABLE',
    bg: 'bg-gradient-to-b from-[#064e3b] to-[#022c22]',
    qrFg: '#ffffff',
    qrBg: '#065f46',
    accent: '#10b981',
    previewType: 'menu',
  },
  {
    id: 'wifi',
    tag: 'Free Wi-Fi',
    title: 'Join Our Wi-Fi',
    bg: 'bg-gradient-to-b from-[#eff6ff] to-[#dbeafe]',
    qrFg: '#1d4ed8',
    qrBg: '#ffffff',
    accent: '#2563eb',
    previewType: 'wifi',
  },
  {
    id: 'app',
    tag: 'iOS & Android',
    title: 'Download Our App',
    bg: 'bg-gradient-to-b from-[#18181b] to-[#09090b]',
    qrFg: '#ffffff',
    qrBg: '#27272a',
    accent: '#f59e0b',
    previewType: 'app',
  },
]

function scrollToStudio() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function MainApp() {
  const [templateIdx, setTemplateIdx] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className="min-h-screen text-slate-900 font-sans collage-bg relative overflow-hidden">
      
      {/* ── BACKGROUND ARTISTIC COLLAGE SHAPES ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right pink & orange watercolor splash */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-pink-300/40 via-purple-300/30 to-amber-200/40 blur-3xl" />
        {/* Top-left yellow splash */}
        <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-yellow-200/50 blur-3xl" />
        {/* Center cyan splash */}
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/35 blur-3xl" />
        {/* Bottom lime splash */}
        <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-200/30 blur-3xl" />

        {/* Botanical leaf decorations (SVG vectors) */}
        <svg className="absolute top-4 left-[-20px] w-48 h-48 opacity-25" viewBox="0 0 100 100" fill="#047857">
          <path d="M10,80 Q30,20 80,10 Q90,50 40,90 Z" />
          <path d="M20,70 Q50,40 70,20" stroke="#065f46" strokeWidth="2" fill="none" />
        </svg>

        <svg className="absolute top-12 right-[-10px] w-56 h-56 opacity-25" viewBox="0 0 100 100" fill="#059669">
          <path d="M90,80 Q70,20 20,10 Q10,50 60,90 Z" />
          <path d="M80,70 Q50,40 30,20" stroke="#047857" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* ── 1. NAVBAR (FLOATING PILL - NO LOGIN BUTTON) ─────────────── */}
      <header className="sticky top-4 inset-x-0 z-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-16 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30">
              <QrCode className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Qraft
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#" className="text-slate-900 font-bold hover:text-purple-600 transition-colors">Home</a>
            <a href="#generator" className="hover:text-purple-600 transition-colors">Create</a>
            <a href="#templates" className="hover:text-purple-600 transition-colors">Templates</a>
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">FAQs</a>
          </nav>

          {/* Right Action: Theme toggle + "Create QR →" (NO LOGIN BUTTON) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              onClick={scrollToStudio}
              className="btn-qraft-primary text-xs !py-2.5 !px-5"
            >
              <span>Create QR</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge + Crown doodle */}
              <div className="flex items-center gap-2">
                <span className="qraft-pill qraft-pill-yellow">
                  100% FREE • NO SIGN UP • NO LIMITS
                </span>
                <span className="text-slate-800 text-lg font-handwriting select-none">👑</span>
              </div>

              {/* Headline with Yellow marker stroke */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
                Create beautiful <br />
                QR codes for <br />
                <span className="text-[#6d28d9] relative inline-block">
                  anything.
                  {/* Highlighter marker doodle */}
                  <span className="absolute -bottom-1 inset-x-0 h-3 bg-yellow-300 -z-10 rounded-sm -rotate-1 opacity-80" />
                </span>
              </h1>

              <p className="text-base text-slate-600 font-medium max-w-lg leading-relaxed">
                Generate, customize and download high-quality QR codes <strong className="text-slate-900">instantly — completely free</strong>. No account, no watermark, no restrictions.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToStudio}
                  className="btn-qraft-primary text-sm !py-3.5 !px-7"
                >
                  <span>Create QR Code</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-qraft-secondary text-sm !py-3.5 !px-6"
                >
                  <span>Explore Templates</span>
                </button>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">JD</div>
                  <div className="h-7 w-7 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">MK</div>
                  <div className="h-7 w-7 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">AL</div>
                  <div className="h-7 w-7 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">TC</div>
                </div>
                <p className="text-xs text-slate-500">
                  Loved by <strong className="text-slate-800">50,000+</strong> creators, businesses and students.
                </p>
              </div>

            </div>

            {/* Right Collage Visual (Tilted QR Cards + Hand-drawn Doodles) */}
            <div className="lg:col-span-6 relative flex justify-center py-8">
              
              {/* Handwriting annotation top left */}
              <div className="absolute top-0 left-6 z-20 hidden sm:block">
                <p className="font-handwriting text-xl text-slate-800 font-bold -rotate-6">
                  Same QR. <br />More personality.
                </p>
                <span className="text-slate-700 text-lg block -rotate-12 ml-6">⤵</span>
              </div>

              {/* Handwriting annotation top right */}
              <div className="absolute -top-4 right-0 z-20 hidden sm:block text-right">
                <p className="font-handwriting text-lg text-slate-700 max-w-[140px] leading-tight rotate-3">
                  Turn ideas into experiences with a single scan.
                </p>
              </div>

              {/* Collage Container */}
              <div className="relative w-full max-w-[420px] h-[400px]">
                
                {/* 1. Top Right Tilted Card: "The Good Bowl - OUR MENU" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-8 top-0 w-36 bg-[#182a24] text-white p-3 rounded-2xl shadow-xl border border-white/10 -rotate-6 z-10"
                >
                  <p className="text-[10px] font-bold text-emerald-400">The</p>
                  <p className="text-xs font-black tracking-wider text-white">Good Bowl</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-300">OUR MENU</p>
                  <div className="mt-2 p-1.5 bg-white rounded-lg">
                    <QrCode className="h-16 w-16 mx-auto text-[#182a24]" />
                  </div>
                </motion.div>

                {/* 2. Right Tilted Card: "Follow Us" Pink card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute -right-2 top-20 w-32 bg-gradient-to-b from-pink-100 to-rose-100 p-3 rounded-2xl shadow-xl border border-pink-200 rotate-12 z-20"
                >
                  <p className="text-[10px] font-bold text-rose-700 text-center">Follow Us</p>
                  <div className="mt-1.5 p-1 bg-white rounded-lg">
                    <QrCode className="h-14 w-14 mx-auto text-rose-600" />
                  </div>
                </motion.div>

                {/* 3. Middle Right Card: "Let's Connect" Yellow card with LinkedIn */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute right-12 top-48 w-32 bg-amber-200 p-3 rounded-2xl shadow-xl border border-amber-300 -rotate-3 z-30"
                >
                  <p className="text-[10px] font-bold text-amber-900 text-center">Let&apos;s Connect</p>
                  <div className="mt-1 p-1 bg-white rounded-lg">
                    <QrCode className="h-14 w-14 mx-auto text-amber-900" />
                  </div>
                </motion.div>

                {/* 4. Bottom Right Card: "Get App" Blue card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -right-4 bottom-2 w-32 bg-sky-200 p-3 rounded-2xl shadow-xl border border-sky-300 rotate-6 z-20"
                >
                  <p className="text-[10px] font-bold text-sky-900 text-center">Get App</p>
                  <div className="mt-1 p-1 bg-white rounded-lg">
                    <QrCode className="h-14 w-14 mx-auto text-sky-900" />
                  </div>
                </motion.div>

                {/* 5. Center Main Hero Card: Pink/Purple Watercolor with "SCAN ME" */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute left-6 top-8 w-56 bg-white p-5 rounded-3xl shadow-2xl border border-purple-100 z-30 -rotate-2"
                >
                  {/* Watercolor framed QR */}
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-100 via-pink-100 to-amber-100 border border-purple-200 text-center">
                    <QrCode className="h-32 w-32 mx-auto text-[#6d28d9]" />
                  </div>

                  {/* "SCAN ME" Black Pill Button */}
                  <div className="mt-3 text-center">
                    <span className="inline-block px-5 py-1.5 rounded-full bg-slate-950 text-white font-extrabold text-xs tracking-wider shadow-md">
                      SCAN ME
                    </span>
                  </div>
                </motion.div>

                {/* Yellow Smiley Face Sticker 🙂 */}
                <div className="absolute left-40 bottom-12 z-40 h-10 w-10 rounded-full bg-yellow-300 border-2 border-slate-900 shadow-md flex items-center justify-center text-lg select-none">
                  🙂
                </div>

                {/* Crown Doodle 👑 */}
                <div className="absolute right-28 top-28 z-40 text-2xl font-handwriting select-none -rotate-12">
                  👑
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. 5 VALUE PROPS BAR ───────────────────────────────────── */}
      <section className="px-6 py-6 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon
            return (
              <div
                key={vp.title}
                className="qraft-card p-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm"
              >
                <div className={`h-10 w-10 rounded-xl ${vp.iconBg} grid place-items-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{vp.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{vp.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. USE CASES SECTION ───────────────────────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="qraft-pill qraft-pill-yellow mb-2.5">
                USE CASES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>One QR code. Endless possibilities.</span>
                <span className="text-slate-400 text-lg font-handwriting select-none">彡</span>
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                From personal use to business needs, create QR codes for anything — instantly and for free.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Handwritten "GOOD IDEAS SCAN BETTER" sticker */}
              <div className="hidden md:flex items-center gap-1.5 font-handwriting text-sm font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 -rotate-3">
                <span>GOOD IDEAS SCAN BETTER</span>
                <span>🪩</span>
              </div>

              <button
                onClick={scrollToStudio}
                className="btn-qraft-secondary text-xs !py-2 !px-4"
              >
                <span>View all Use Cases</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 12 Use Case Cards (2 rows of 6) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon
              return (
                <button
                  key={uc.id}
                  onClick={scrollToStudio}
                  className="qraft-card p-4 text-center flex flex-col items-center group cursor-pointer hover:bg-slate-50/50"
                >
                  <div className={`h-12 w-12 rounded-2xl ${uc.iconBg} grid place-items-center mb-3 transition-transform group-hover:scale-110 shadow-xs`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs">{uc.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{uc.sub}</p>
                </button>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 5. TEMPLATES SECTION (DARK ROUNDED BANNER) ──────────────── */}
      <section id="templates" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#0c1220] p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-4 space-y-4">
              <span className="qraft-pill qraft-pill-pink">
                TEMPLATES
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Beautiful templates for every need.
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Choose from a wide range of professionally designed QR code templates. Fully customizable and completely free.
              </p>

              <div className="pt-2">
                <button
                  onClick={scrollToStudio}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore All Templates</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Carousel of Cards */}
            <div className="lg:col-span-8">
              
              {/* Top controls in dark card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTemplateIdx((prev) => (prev > 0 ? prev - 1 : TEMPLATE_CARDS.length - 1))}
                    className="h-8 w-8 rounded-full border border-slate-700 bg-slate-850 hover:bg-slate-800 grid place-items-center text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setTemplateIdx((prev) => (prev < TEMPLATE_CARDS.length - 1 ? prev + 1 : 0))}
                    className="h-8 w-8 rounded-full border border-slate-700 bg-slate-850 hover:bg-slate-800 grid place-items-center text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={scrollToStudio}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Download</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* 5 Showcase Template Cards in a Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {TEMPLATE_CARDS.map((tpl, i) => (
                  <div
                    key={tpl.id}
                    onClick={scrollToStudio}
                    className={`rounded-2xl p-3.5 text-center cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 border ${
                      templateIdx === i ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-102 opacity-90'
                    } ${tpl.bg}`}
                  >
                    <div>
                      <p className="text-[9px] font-semibold text-slate-300 truncate">{tpl.tag}</p>
                      <h4 className="text-xs font-black text-white truncate mt-0.5">{tpl.title}</h4>
                    </div>

                    <div className="my-auto py-2">
                      <div className="p-2 rounded-xl mx-auto inline-block" style={{ backgroundColor: tpl.qrBg }}>
                        <QrCode className="h-14 w-14 mx-auto" style={{ color: tpl.qrFg }} />
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono">
                      Qraft · Free
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 6. CREATE & CUSTOMIZE (STUDIO WORKBENCH) ────────────────── */}
      <section id="generator" className="py-20 px-6 relative z-10 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start mb-8">
            
            {/* Left Title & Checklist */}
            <div className="lg:col-span-4 space-y-4">
              <span className="qraft-pill qraft-pill-yellow">
                CREATE & CUSTOMIZE
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Design your QR code in real time.
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Make it truly yours with a live preview.
              </p>

              {/* 6 Feature Bullets */}
              <div className="space-y-3 pt-3">
                {[
                  { text: 'Multiple styles & patterns', color: 'bg-purple-100 text-purple-700' },
                  { text: 'Custom colors and gradients', color: 'bg-rose-100 text-rose-700' },
                  { text: 'Add your logo', color: 'bg-emerald-100 text-emerald-700' },
                  { text: 'Choose frame and text', color: 'bg-sky-100 text-sky-700' },
                  { text: 'Live preview', color: 'bg-indigo-100 text-indigo-700' },
                  { text: 'High-quality download (PNG, SVG)', color: 'bg-purple-100 text-purple-700' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                    <span className={`h-5 w-5 rounded-full ${item.color} grid place-items-center text-[10px]`}>
                      ✓
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: The Interactive QRBuilder Component */}
            <div className="lg:col-span-8">
              <QRBuilder />
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Title */}
            <div className="lg:col-span-4 space-y-3">
              <span className="qraft-pill qraft-pill-purple">
                HOW IT WORKS
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Create your QR code in 3 simple steps.
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Fast. Easy. Completely free.
              </p>

              {/* Hand-drawn doodle stars & squiggles */}
              <div className="pt-2 text-2xl font-handwriting select-none text-slate-500">
                〰️ ★ ✦
              </div>
            </div>

            {/* Center: 3 Clean Step Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Step 1 */}
              <div className="qraft-card p-4 flex flex-col justify-between">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-purple-600 text-white font-bold text-xs grid place-items-center mb-3">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Choose a type</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Select what you want to share — website, text, Wi-Fi and more.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="qraft-card p-4 flex flex-col justify-between">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white font-bold text-xs grid place-items-center mb-3">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Customize</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Design your QR code with colors, logo and style.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="qraft-card p-4 flex flex-col justify-between">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white font-bold text-xs grid place-items-center mb-3">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Download</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Get your high-quality QR code instantly. It&apos;s free!
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Smartphone Mockup with "Ready to create yours?" */}
            <div className="lg:col-span-3 relative flex justify-center">
              <div className="relative w-40 bg-slate-950 p-2.5 rounded-3xl shadow-xl border-4 border-slate-800 text-center">
                <div className="w-12 h-3 bg-slate-800 rounded-full mx-auto mb-2" />
                <div className="bg-white rounded-2xl p-3">
                  <QrCode className="h-20 w-20 mx-auto text-slate-900" />
                  <p className="text-[9px] font-bold text-slate-700 mt-2">Ready to create yours?</p>
                </div>
              </div>

              {/* Annotation arrow pointing to phone */}
              <div className="absolute -bottom-6 -left-6 font-handwriting text-lg font-bold text-slate-800 -rotate-12 hidden sm:block">
                <span>Scan instant ➔</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 8. WHY CHOOSE QRAFT ────────────────────────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mb-10">
            <span className="qraft-pill qraft-pill-pink mb-2.5">
              WHY CHOOSE QRAFT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple. Transparent. <br />Completely free.
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Everything you need to create stunning QR codes, without any limitations.
            </p>
          </div>

          {/* 6 Feature Cards in 2x3 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-600 grid place-items-center shrink-0">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Free</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  No hidden fees, forever.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 grid place-items-center shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">No Sign Up</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Start creating instantly.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">No Watermark</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Your QR codes are clean.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 grid place-items-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">High Quality</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Download in PNG, SVG.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 grid place-items-center shrink-0">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Fully Customizable</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Colors, patterns, logos.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="qraft-card p-5 bg-white/95 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center shrink-0">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Works Everywhere</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Scan on any device.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 9. FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#090d19] text-slate-400 pt-16 pb-12 px-6 relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-slate-800">
            
            {/* Left Brand */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="grid place-items-center h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                  <QrCode className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Qraft</span>
              </div>
              <p className="text-xs text-slate-400">
                The free QR code generator for everyone.
              </p>
            </div>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#generator" className="hover:text-white transition-colors">Create</a>
              <a href="#templates" className="hover:text-white transition-colors">Templates</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">FAQs</a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><Share2 className="h-4 w-4" /></a>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Qraft. All rights reserved. 100% free, forever.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400">Privacy</a>
              <a href="#" className="hover:text-slate-400">Terms</a>
              <a href="#" className="hover:text-slate-400">Contact</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
