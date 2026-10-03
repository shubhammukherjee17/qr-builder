'use client'

import React, { useState } from 'react'
import QRBuilder from '@/components/QRBuilder'
import { AuthProvider } from '@/contexts/AuthContext'
import {
  MonsteraLeaf, PalmFrond, DoodleCrown, DoodleArrow,
  DoodleSquiggle, DiscoBallSticker,
  WashiTape, RetroStamp, SparkleIcon, DiscoBallSketch,
  PhoneScanMockup
} from '@/components/CollageDecorations'
import {
  QrCode, ArrowRight, Globe, Share2, Contact, Wifi, Ticket,
  Utensils, Sparkles, Check, ChevronDown, ChevronLeft, ChevronRight,
  ShieldCheck, MapPin, Smartphone, Clock, Mail, Phone, FileText,
  MoreHorizontal, Download, Gift, UserCheck, Shield,
  Layers, Sliders, Laptop, Heart, Undo2, Redo2, Star,
  Linkedin, Instagram, Apple
} from 'lucide-react'
import { motion } from 'framer-motion'

const VALUE_PROPS = [
  {
    title: 'Completely Free',
    sub: 'No hidden charges',
    icon: Gift,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'No Sign Up',
    sub: 'Create in seconds',
    icon: UserCheck,
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'High-Quality',
    sub: 'Print & digital ready',
    icon: Layers,
    iconBg: 'bg-sky-100 text-sky-600',
  },
  {
    title: 'Fully Customizable',
    sub: 'Colors, logo, style',
    icon: Sliders,
    iconBg: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Works Everywhere',
    sub: 'Scan on any device',
    icon: Laptop,
    iconBg: 'bg-indigo-100 text-indigo-600',
  },
]

const USE_CASES = [
  { id: 'website', title: 'Website', sub: 'Link to any URL', icon: Globe, iconBg: 'bg-purple-100 text-purple-600' },
  { id: 'text', title: 'Text', sub: 'Share a message', icon: FileText, iconBg: 'bg-amber-100 text-amber-600' },
  { id: 'email', title: 'Email', sub: 'Open email app', icon: Mail, iconBg: 'bg-indigo-100 text-indigo-600' },
  { id: 'phone', title: 'Phone', sub: 'Make a call', icon: Phone, iconBg: 'bg-emerald-100 text-emerald-600' },
  { id: 'wifi', title: 'Wi-Fi', sub: 'Share Wi-Fi instantly', icon: Wifi, iconBg: 'bg-sky-100 text-sky-600' },
  { id: 'location', title: 'Location', sub: 'Share a location', icon: MapPin, iconBg: 'bg-rose-100 text-rose-600' },
  { id: 'vcard', title: 'vCard', sub: 'Share contact details', icon: Contact, iconBg: 'bg-teal-100 text-teal-600' },
  { id: 'social', title: 'Social Media', sub: 'Link all your profiles', icon: Share2, iconBg: 'bg-blue-100 text-blue-600' },
  { id: 'pdf', title: 'PDF', sub: 'Share documents', icon: FileText, iconBg: 'bg-pink-100 text-pink-600' },
  { id: 'app', title: 'App Download', sub: 'iOS & Android', icon: Smartphone, iconBg: 'bg-emerald-100 text-emerald-600' },
  { id: 'menu', title: 'Menu', sub: 'Restaurant menu', icon: Utensils, iconBg: 'bg-orange-100 text-orange-600' },
  { id: 'more', title: 'More', sub: 'And many more', icon: MoreHorizontal, iconBg: 'bg-slate-200 text-slate-700' },
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
    customBottom: 'coffee',
  },
  {
    id: 'instagram',
    tag: 'on Instagram',
    title: 'Follow Us',
    bg: 'bg-gradient-to-b from-[#fce7f3] to-[#fbcfe8]',
    qrFg: '#be185d',
    qrBg: '#ffffff',
    accent: '#ec4899',
    customBottom: 'instagram',
  },
  {
    id: 'restaurant',
    tag: 'Restaurant Menu',
    title: 'THE GREEN TABLE',
    bg: 'bg-gradient-to-b from-[#064e3b] to-[#022c22]',
    qrFg: '#ffffff',
    qrBg: '#065f46',
    accent: '#10b981',
    customBottom: 'restaurant',
  },
  {
    id: 'wifi',
    tag: 'Free Wi-Fi',
    title: 'Join Our Wi-Fi',
    bg: 'bg-white',
    qrFg: '#1d4ed8',
    qrBg: '#eff6ff',
    accent: '#2563eb',
    textColor: 'text-slate-900',
    customBottom: 'wifi',
  },
  {
    id: 'app',
    tag: 'iOS & Android',
    title: 'Download Our App',
    bg: 'bg-gradient-to-b from-[#1e1b2e] to-[#0f0e17]',
    qrFg: '#ffffff',
    qrBg: '#27272a',
    accent: '#f59e0b',
    customBottom: 'app',
  },
]

function scrollToStudio() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function MainApp() {
  const [templateIdx, setTemplateIdx] = useState(0)

  return (
    <div className="min-h-screen text-slate-900 font-sans collage-container relative overflow-x-hidden">
      
      {/* ── RICH MAXIMALIST COLLAGE BACKGROUND ELEMENTS ───────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        
        {/* Tropical Monstera Leaf top-right */}
        <MonsteraLeaf className="absolute -top-12 -right-12 w-64 h-72 opacity-45 rotate-[25deg] hidden sm:block" />
        
        {/* Palm Frond top-left */}
        <PalmFrond className="absolute top-8 -left-10 w-52 h-64 opacity-40 rotate-[-15deg] hidden sm:block" />

        {/* Monstera Leaf on right side near studio */}
        <MonsteraLeaf className="absolute top-[48%] -right-16 w-72 h-80 opacity-40 rotate-[-20deg]" />

        {/* Palm Frond on left side near studio */}
        <PalmFrond className="absolute top-[52%] -left-12 w-60 h-72 opacity-35 rotate-[35deg]" />

        {/* Monstera Leaf bottom left */}
        <MonsteraLeaf className="absolute bottom-24 -left-16 w-64 h-72 opacity-40 rotate-[45deg] hidden sm:block" />

        {/* Palm Frond bottom right near how-it-works */}
        <PalmFrond className="absolute bottom-16 -right-10 w-56 h-68 opacity-40 rotate-[-30deg] hidden sm:block" />

        {/* Painted watercolor splash blooms matching reference image */}
        <div className="absolute top-16 right-[12%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-pink-300/45 via-purple-300/35 to-amber-200/45 blur-3xl" />
        <div className="absolute top-[32%] left-[4%] w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-yellow-200/50 via-pink-200/40 to-cyan-200/40 blur-3xl" />
        <div className="absolute top-[65%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-200/40 via-purple-200/35 to-rose-200/40 blur-3xl" />
        <div className="absolute top-[80%] left-[8%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-yellow-200/45 via-emerald-200/35 to-pink-200/40 blur-3xl" />
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              
              {/* Badge + Crown doodle */}
              <div className="flex items-center gap-2">
                <span className="qraft-pill qraft-pill-yellow">
                  100% FREE • NO SIGN UP • NO LIMITS
                </span>
                <DoodleCrown className="w-6 h-5 -rotate-12 inline-block text-amber-500" />
              </div>

              {/* Headline with Yellow marker stroke */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.06]">
                Create beautiful <br />
                QR codes for <br />
                <span className="text-[#6d28d9] relative inline-block">
                  anything.
                  {/* Highlighter marker doodle */}
                  <span className="absolute -bottom-1 inset-x-0 h-3 sm:h-4 bg-yellow-300 -z-10 rounded-sm -rotate-1 opacity-80" />
                </span>
                <span className="text-slate-400 text-3xl font-handwriting select-none ml-2">彡</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-700 font-medium max-w-lg leading-relaxed">
                Generate, customize and download high-quality QR codes <strong className="text-slate-950 font-bold">instantly — completely free</strong>. No account, no watermark, no restrictions.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={scrollToStudio}
                  className="btn-qraft-primary text-xs sm:text-sm !py-3 !px-6 sm:!py-3.5 sm:!px-7 rounded-full shadow-lg"
                >
                  <span>Create QR Code</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-qraft-secondary text-xs sm:text-sm !py-3 !px-5 sm:!py-3.5 sm:!px-6 rounded-full"
                >
                  <span>Explore Templates</span>
                </button>
              </div>

            </div>

            {/* Right Collage Visual (Tilted QR Cards + Hand-drawn Doodles) */}
            <div className="lg:col-span-6 relative flex justify-center py-6 sm:py-8">
              
              {/* Handwriting annotation top left */}
              <div className="absolute -top-3 left-4 z-20 hidden sm:block">
                <p className="font-handwriting text-xl text-slate-900 font-bold -rotate-6">
                  Same QR. <br />More personality.
                </p>
                <DoodleArrow className="w-10 h-8 -rotate-12 ml-6 text-slate-800" />
              </div>

              {/* Handwriting annotation top right */}
              <div className="absolute -top-6 right-2 z-20 hidden sm:block text-right">
                <p className="font-handwriting text-lg text-slate-800 font-bold max-w-[150px] leading-tight rotate-3">
                  Turn ideas into experiences with a single scan.
                </p>
              </div>

              {/* Collage Container */}
              <div className="relative w-full max-w-[390px] sm:max-w-[440px] h-[370px] sm:h-[420px]">
                
                {/* 1. Top Right Tilted Card: "The Good Bowl - OUR MENU" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-4 sm:right-6 top-0 w-36 sm:w-40 bg-[#162720] text-white p-3 rounded-2xl shadow-xl border border-white/10 -rotate-6 z-10"
                >
                  <p className="text-[10px] font-bold text-emerald-400">The</p>
                  <p className="text-xs font-black tracking-wider text-white">Good Bowl</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-300">OUR MENU</p>
                  <div className="mt-2 p-1.5 bg-white rounded-lg">
                    <QrCode className="h-14 sm:h-16 w-14 sm:w-16 mx-auto text-[#162720]" />
                  </div>
                </motion.div>

                {/* Crown Doodle next to Good Bowl */}
                <DoodleCrown className="absolute right-1 top-2 w-7 h-5 rotate-12 z-20 text-yellow-400" />

                {/* 2. Right Tilted Card: "Follow Us" Pink Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute -right-1 sm:-right-2 top-20 sm:top-24 w-32 sm:w-34 bg-gradient-to-b from-[#fdf2f8] to-[#fce7f3] p-2.5 sm:p-3 rounded-2xl shadow-xl border border-pink-200 rotate-12 z-20"
                >
                  <p className="text-[11px] font-bold text-rose-700 text-center">Follow Us</p>
                  <div className="mt-1.5 p-1 bg-white rounded-lg">
                    <QrCode className="h-12 sm:h-14 w-12 sm:w-14 mx-auto text-rose-600" />
                  </div>
                </motion.div>

                {/* 3. Middle Right Card: "Let's Connect" Yellow Card with LinkedIn */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute right-10 sm:right-14 top-48 sm:top-52 w-32 sm:w-34 bg-[#fef08a] p-2.5 sm:p-3 rounded-2xl shadow-xl border border-amber-300 -rotate-3 z-30"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-[10px] font-black text-slate-900">Let&apos;s Connect</span>
                    <Linkedin className="h-3 w-3 text-blue-700 fill-current" />
                  </div>
                  <div className="p-1 bg-white rounded-lg">
                    <QrCode className="h-12 sm:h-14 w-12 sm:w-14 mx-auto text-slate-900" />
                  </div>
                </motion.div>

                {/* 4. Bottom Right Card: "Get App" Blue Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -right-2 sm:-right-4 bottom-2 w-32 sm:w-34 bg-[#e0f2fe] p-2.5 sm:p-3 rounded-2xl shadow-xl border border-sky-300 rotate-6 z-20"
                >
                  <p className="text-[10px] font-black text-sky-950 text-center mb-1">Get App</p>
                  <div className="p-1 bg-white rounded-lg">
                    <QrCode className="h-12 sm:h-14 w-12 sm:w-14 mx-auto text-sky-950" />
                  </div>
                </motion.div>

                {/* 5. Center Main Hero Card: Pink/Purple Watercolor with "SCAN ME" */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute left-2 sm:left-4 top-8 w-52 sm:w-60 bg-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-purple-200 z-30 -rotate-2"
                >
                  {/* Watercolor framed QR */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-100 via-pink-100 to-amber-100 border border-purple-200 text-center relative">
                    <QrCode className="h-32 sm:h-36 w-32 sm:w-36 mx-auto text-[#6d28d9]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-[#6d28d9] bg-white rounded-md p-0.5 shadow-xs" />
                    </div>
                  </div>

                  {/* "SCAN ME" Black Pill Button */}
                  <div className="mt-3 text-center">
                    <span className="inline-block px-5 py-1.5 rounded-full bg-slate-950 text-white font-extrabold text-xs tracking-wider shadow-md">
                      SCAN ME
                    </span>
                  </div>
                </motion.div>

                {/* Purple Disco Ball / Globe Sketch with Sparkles */}
                <DiscoBallSketch className="absolute left-24 sm:left-28 bottom-2 w-20 h-20 opacity-70 z-10" />

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. 5 VALUE PROPS BAR ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-4 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
          {VALUE_PROPS.map((vp) => {
            const Icon = vp.icon
            return (
              <div
                key={vp.title}
                className="qraft-card p-3.5 sm:p-4 flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm"
              >
                <div className={`h-10 w-10 rounded-xl ${vp.iconBg} grid place-items-center shrink-0`}>
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-black text-slate-900 truncate">{vp.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{vp.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 4. USE CASES SECTION ───────────────────────────────────── */}
      <section id="use-cases" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="qraft-pill qraft-pill-yellow mb-2.5">
                USE CASES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>One QR code. Endless possibilities.</span>
                <span className="text-slate-400 text-lg font-handwriting select-none">彡</span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                From personal use to business needs, create QR codes for anything — instantly and for free.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Handwritten "GOOD IDEAS SCAN BETTER" sticker */}
              <DiscoBallSticker className="hidden md:inline-flex -rotate-3" />

              <button
                onClick={scrollToStudio}
                className="btn-qraft-secondary text-xs !py-2.5 !px-4 rounded-full font-bold"
              >
                <span>View all Use Cases</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 12 Use Case Cards in 2 rows of 6 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon
              return (
                <button
                  key={uc.id}
                  onClick={scrollToStudio}
                  className="qraft-card p-3.5 sm:p-4 text-center flex flex-col items-center group cursor-pointer hover:bg-slate-50/70 border border-slate-200/90 shadow-xs"
                >
                  <div className={`h-11 sm:h-12 w-11 sm:w-12 rounded-2xl ${uc.iconBg} grid place-items-center mb-2.5 sm:mb-3 transition-transform group-hover:scale-110 shadow-xs`}>
                    <Icon className="h-5 sm:h-6 w-5 sm:w-6 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-xs truncate max-w-full">{uc.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">{uc.sub}</p>
                </button>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── 5. TEMPLATES SECTION (DARK ROUNDED BANNER) ──────────────── */}
      <section id="templates" className="py-14 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#0c1220] p-6 sm:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <span className="qraft-pill qraft-pill-pink">
                TEMPLATES
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Beautiful templates for every need.
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Choose from a wide range of professionally designed QR code templates. Fully customizable and completely free.
              </p>

              <div className="pt-2">
                <button
                  onClick={scrollToStudio}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore All Templates</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Carousel of Cards */}
            <div className="lg:col-span-8">
              
              {/* Top controls in dark card */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTemplateIdx((prev) => (prev > 0 ? prev - 1 : TEMPLATE_CARDS.length - 1))}
                    className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setTemplateIdx((prev) => (prev < TEMPLATE_CARDS.length - 1 ? prev + 1 : 0))}
                    className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 grid place-items-center text-slate-300 transition-colors cursor-pointer"
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

              {/* 5 Showcase Template Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {TEMPLATE_CARDS.map((tpl, i) => (
                  <div
                    key={tpl.id}
                    onClick={scrollToStudio}
                    className={`rounded-2xl p-3 text-center cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 sm:h-52 border ${
                      templateIdx === i ? 'ring-2 ring-purple-500 scale-102 sm:scale-105' : 'hover:scale-102 opacity-90'
                    } ${tpl.bg} ${tpl.textColor || 'text-white'}`}
                  >
                    <div>
                      <p className="text-[9px] font-bold opacity-80 truncate">{tpl.tag}</p>
                      <h4 className="text-[11px] sm:text-xs font-black truncate mt-0.5">{tpl.title}</h4>
                    </div>

                    <div className="my-auto py-1.5">
                      <div className="p-2 rounded-xl mx-auto inline-block shadow-sm" style={{ backgroundColor: tpl.qrBg }}>
                        <QrCode className="h-12 sm:h-14 w-12 sm:w-14 mx-auto" style={{ color: tpl.qrFg }} />
                      </div>
                    </div>

                    {/* Custom Template Bottom Elements */}
                    <div className="text-[9px] font-mono opacity-70">
                      {tpl.customBottom === 'coffee' && '☕ Latte Art'}
                      {tpl.customBottom === 'instagram' && '📷 Follow'}
                      {tpl.customBottom === 'restaurant' && '🌿 Organic'}
                      {tpl.customBottom === 'wifi' && '📶 Connect'}
                      {tpl.customBottom === 'app' && '📱 App Store'}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 6. CREATE & CUSTOMIZE (STUDIO WORKBENCH - SIDE-BY-SIDE MATCHING SCREENSHOT) ── */}
      <section id="generator" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Pitch & Feature Checklist */}
            <div className="lg:col-span-4 space-y-6 pt-2">
              
              <div>
                <span className="qraft-pill qraft-pill-yellow mb-2.5">
                  CREATE & CUSTOMIZE
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Design your QR code in real time.
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1.5 leading-relaxed">
                  Make it truly yours with a live preview. Completely free, no restrictions.
                </p>
              </div>

              {/* 6 Feature Checklist Badges with circular colorful checkmarks */}
              <div className="space-y-3">
                {[
                  { text: 'Multiple styles & patterns', color: 'bg-purple-600 text-white' },
                  { text: 'Custom colors and gradients', color: 'bg-rose-500 text-white' },
                  { text: 'Add your logo', color: 'bg-teal-500 text-white' },
                  { text: 'Choose frame and text', color: 'bg-sky-500 text-white' },
                  { text: 'Live preview', color: 'bg-blue-600 text-white' },
                  { text: 'High-quality download (PNG, SVG)', color: 'bg-purple-700 text-white' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded-full ${item.color} grid place-items-center text-[10px] font-black shrink-0 shadow-xs`}>
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Doodle & Stamp */}
              <div className="pt-2 flex items-center gap-4">
                <RetroStamp text="100% FREE" subText="NO WATERMARK" className="rotate-[-3deg]" />
                <div className="font-handwriting text-base font-bold text-purple-800 rotate-2">
                  <span>Instant vector export ✦</span>
                </div>
              </div>

            </div>

            {/* Right Column: The Live Studio Workbench */}
            <div className="lg:col-span-8 relative">
              <QRBuilder />
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Title */}
            <div className="lg:col-span-4 space-y-3">
              <span className="qraft-pill qraft-pill-purple">
                HOW IT WORKS
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Create your QR code in 3 simple steps.
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                Fast. Easy. Completely free.
              </p>

              {/* Hand-drawn doodle stars & squiggles */}
              <div className="pt-2 text-xl font-handwriting select-none text-slate-700 flex items-center gap-2">
                <span>〰️</span>
                <span>★</span>
                <span>✦</span>
              </div>
            </div>

            {/* Center: 3 Clean Step Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Step 1 */}
              <div className="qraft-card p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-purple-600 text-white font-black text-xs grid place-items-center mb-3">
                    1
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Choose a type</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Select what you want to share — website, text, Wi-Fi and more.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="qraft-card p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white font-black text-xs grid place-items-center mb-3">
                    2
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Customize</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Design your QR code with colors, logo and style.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="qraft-card p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm">
                <div>
                  <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white font-black text-xs grid place-items-center mb-3">
                    3
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Download</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Get your high-quality QR code instantly. It&apos;s free!
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Realistic Phone Scan Mockup */}
            <div className="lg:col-span-3 relative flex justify-center pt-4 lg:pt-0">
              <PhoneScanMockup />
            </div>

          </div>

        </div>
      </section>

      {/* ── 8. WHY CHOOSE QRAFT ────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="qraft-pill qraft-pill-pink mb-2.5">
              WHY CHOOSE QRAFT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple. Transparent. <br />Completely free.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
              Everything you need to create stunning QR codes, without any limitations.
            </p>
          </div>

          {/* 6 Feature Cards in 2x3 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            {/* Card 1 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-pink-100 text-pink-600 grid place-items-center shrink-0">
                <Gift className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">100% Free</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  No hidden fees, forever.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 grid place-items-center shrink-0">
                <UserCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">No Sign Up</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Start creating instantly.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 grid place-items-center shrink-0">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">No Watermark</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Your QR codes are clean.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 grid place-items-center shrink-0">
                <Layers className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">High Quality</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Download in PNG, SVG.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-600 grid place-items-center shrink-0">
                <Sliders className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">Fully Customizable</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Colors, patterns, logos.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="qraft-card p-4 sm:p-5 bg-white/95 flex items-start gap-4 border border-slate-200/90 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 grid place-items-center shrink-0">
                <Globe className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">Works Everywhere</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                  Scan on any device.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── MINIMAL FOOTER ────────────────────────────────── */}
      <footer className="py-8 px-4 sm:px-6 border-t border-slate-200/90 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 tracking-tight text-sm">Qraft</span>
            <span className="text-slate-300">|</span>
            <span>Free QR Code Generator</span>
          </div>

          <p className="text-slate-400">
            © {new Date().getFullYear()} Qraft. All rights reserved.
          </p>
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
