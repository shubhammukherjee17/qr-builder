'use client'

import QRBuilder from '@/components/QRBuilder'
import QRCube3D from '@/components/QRCube3D'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { QrCode, ArrowDown, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  // Enable smooth scrolling
  useSmoothScroll()

  const scrollToBuilder = () => {
    const generatorSection = document.getElementById('generator')
    if (generatorSection) {
      generatorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* 3D Background - Full Page */}
      <div className="fixed inset-0 z-0">
        <QRCube3D />
      </div>
      
      {/* Minimal Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="relative">
                <QrCode className="h-7 w-7 text-blue-600" />
                <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur-sm"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                QRBuilder
              </span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToBuilder}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create QR
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with 3D Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
            </motion.div>
            <span className="text-sm font-medium text-gray-600 bg-yellow-100 px-3 py-1 rounded-full">
              100% Free Forever
            </span>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
            >
              <Zap className="h-6 w-6 text-yellow-500 ml-2" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              QR Codes
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Generate unlimited QR codes instantly. No signups, no limits, no hassle.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToBuilder}
            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Start Creating</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={20} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.button>
        </div>
      </section>

      {/* QR Builder Section */}
      <motion.section 
        id="generator" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-16 z-20 bg-white/70 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Create Your QR Code
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Generate QR codes for URLs, text, WiFi, contacts and more
            </p>
          </motion.div>
          <QRBuilder />
        </div>
      </motion.section>


      {/* Minimal Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-8 border-t border-gray-200 bg-white/70 backdrop-blur-sm z-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">QRBuilder</span>
            </div>
            <p className="text-sm text-gray-500">
              Built with ❤️ by Shubham Mukherjee
            </p>
          </div>
        </div>
      </motion.footer>

    </div>
  )
}