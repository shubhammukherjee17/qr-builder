'use client'

import { useState } from 'react'
import QRBuilder from '@/components/QRBuilder'
import QRCube3D from '@/components/QRCube3D'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { QrCode, Check, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'home' | 'builder'>('home')
  
  // Enable smooth scrolling
  useSmoothScroll()

  const scrollToBuilder = () => {
    setActiveSection('builder')
  }

  if (activeSection === 'builder') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveSection('home')}
                  className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-blue-600"
                >
                  <QrCode className="h-8 w-8 text-blue-600" />
                  <span>QRBuilder</span>
                </button>
              </div>
              <nav className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveSection('home')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </button>
              </nav>
            </div>
          </div>
        </header>

        <QRBuilder />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">QRBuilder</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#generator" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Generator
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                FAQ
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Elements */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20 lg:py-32 overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-30">
          <QRCube3D />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-3 animate-pulse" />
              <span className="text-xl font-semibold text-yellow-300">100% Free Forever</span>
              <Sparkles className="h-8 w-8 text-yellow-300 ml-3 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Free QR Code Generator
              <span className="block text-blue-200">No Signups • No Limits</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create unlimited QR codes instantly. Customize colors, download high-quality images, 
              and share anywhere - completely free!
            </p>
            
            <button
              onClick={scrollToBuilder}
              className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <span>Create QR Code Now</span>
              <ArrowRight size={20} />
            </button>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check size={16} className="text-green-300" />
                <span>Unlimited QR Codes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check size={16} className="text-green-300" />
                <span>High Quality Downloads</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check size={16} className="text-green-300" />
                <span>Full Customization</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Check size={16} className="text-green-300" />
                <span>No Registration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Builder Section */}
      <section id="generator" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Create Your QR Code
            </h2>
            <p className="text-xl text-gray-600">
              Generate QR codes for URLs, text, WiFi, contacts and more - completely free!
            </p>
          </div>
          <QRBuilder />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about QRBuilder
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What types of QR codes can I create?
              </h3>
              <p className="text-gray-600">
                You can create QR codes for URLs, plain text, WiFi credentials, 
                contact information, and more. Both static and dynamic options are available.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are the QR codes really unlimited?
              </h3>
              <p className="text-gray-600">
                Yes! Our free plan includes unlimited static QR code generation 
                with no hidden fees or limits on scans.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I track QR code analytics?
              </h3>
              <p className="text-gray-600">
                Absolutely! Track scans, locations, devices, and timing data 
                to understand how your QR codes are performing.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What formats can I download?
              </h3>
              <p className="text-gray-600">
                Download your QR codes in PNG, SVG, or PDF formats 
                at various resolutions for print and digital use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-8 w-8 text-blue-400" />
                <h3 className="text-xl font-bold">QRBuilder</h3>
              </div>
              <p className="text-gray-400 mb-6">
                The professional QR code generator for businesses and individuals. 
                Create, customize, and track your QR codes with ease.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#generator" className="hover:text-white transition-colors">QR Generator</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 QRBuilder. Built with ❤️ by Shubham Mukherjee.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}