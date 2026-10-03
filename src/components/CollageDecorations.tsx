'use client'

import React from 'react'

export function MonsteraLeaf({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M100 20C150 40 190 90 180 160C170 210 130 230 100 235C70 230 30 210 20 160C10 90 50 40 100 20Z"
        fill="#065f46"
        opacity="0.85"
      />
      {/* Cutouts */}
      <path d="M100 30L100 220" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 70C120 60 145 65 160 80" stroke="#047857" strokeWidth="3" />
      <path d="M100 110C125 105 155 115 170 135" stroke="#047857" strokeWidth="3" />
      <path d="M100 150C125 150 150 165 160 190" stroke="#047857" strokeWidth="3" />
      <path d="M100 70C80 60 55 65 40 80" stroke="#047857" strokeWidth="3" />
      <path d="M100 110C75 105 45 115 30 135" stroke="#047857" strokeWidth="3" />
      <path d="M100 150C75 150 50 165 40 190" stroke="#047857" strokeWidth="3" />
      {/* Slits */}
      <ellipse cx="140" cy="100" rx="6" ry="18" transform="rotate(35 140 100)" fill="#fbf7ee" />
      <ellipse cx="145" cy="150" rx="6" ry="18" transform="rotate(25 145 150)" fill="#fbf7ee" />
      <ellipse cx="60" cy="100" rx="6" ry="18" transform="rotate(-35 60 100)" fill="#fbf7ee" />
      <ellipse cx="55" cy="150" rx="6" ry="18" transform="rotate(-25 55 150)" fill="#fbf7ee" />
    </svg>
  )
}

export function PalmFrond({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M80 210C80 150 80 80 80 10" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
      {[-40, -20, 0, 20, 40].map((offset, i) => (
        <React.Fragment key={i}>
          <path
            d={`M80 ${50 + i * 30} C110 ${40 + i * 30} 140 ${30 + i * 30} 150 ${50 + i * 30}`}
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d={`M80 ${50 + i * 30} C50 ${40 + i * 30} 20 ${30 + i * 30} 10 ${50 + i * 30}`}
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </React.Fragment>
      ))}
    </svg>
  )
}

export function DoodleCrown({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 28L8 10L18 20L24 6L30 20L40 10L44 28H4Z"
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="#fde047"
      />
      <circle cx="8" cy="8" r="2.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="24" cy="4" r="2.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="40" cy="8" r="2.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
    </svg>
  )
}

export function DoodleArrow({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 30C20 8 40 12 52 24"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M42 26L52 24L50 14"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleSquiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 14C12 4 18 20 28 12C38 4 44 20 54 12C64 4 70 18 76 12"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DiscoBallSticker({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 shadow-xs font-handwriting text-sm font-bold text-emerald-800 ${className}`}>
      <span>GOOD IDEAS SCAN BETTER</span>
      <span className="text-base select-none">🪩</span>
    </div>
  )
}


export function WashiTape({
  color = 'yellow',
  className = '',
}: {
  color?: 'yellow' | 'pink' | 'cyan' | 'lime' | 'purple'
  className?: string
}) {
  const colorMap = {
    yellow: 'bg-amber-200/85 border-amber-400/40 text-amber-900',
    pink: 'bg-pink-200/85 border-pink-400/40 text-pink-900',
    cyan: 'bg-sky-200/85 border-sky-400/40 text-sky-900',
    lime: 'bg-emerald-200/85 border-emerald-400/40 text-emerald-900',
    purple: 'bg-purple-200/85 border-purple-400/40 text-purple-900',
  }
  return (
    <div
      className={`h-5 w-24 border-y border-dashed shadow-xs backdrop-blur-xs select-none pointer-events-none ${colorMap[color]} ${className}`}
      style={{
        clipPath: 'polygon(0% 15%, 4% 0%, 96% 0%, 100% 20%, 98% 85%, 95% 100%, 3% 100%, 0% 80%)',
      }}
    />
  )
}

export function RetroStamp({
  text = '100% FREE',
  subText = 'NO SIGN UP',
  className = '',
}: {
  text?: string
  subText?: string
  className?: string
}) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-2 rounded-xl border-2 border-dashed border-rose-500/80 bg-rose-50/90 text-rose-600 font-mono select-none shadow-xs ${className}`}
    >
      <span className="text-[10px] font-black tracking-widest uppercase">{text}</span>
      {subText && <span className="text-[8px] font-bold tracking-wider opacity-80">{subText}</span>}
    </div>
  )
}

export function PaperClip({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 12V28C8 31.3137 10.6863 34 14 34C17.3137 34 20 31.3137 20 28V8C20 4.68629 17.3137 2 14 2C10.6863 2 8 4.68629 8 8V27C8 28.6569 9.34315 30 11 30C12.6569 30 14 28.6569 14 27V12"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
    </svg>
  )
}

export function DiscoBallSketch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="36" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="3 3" />
      <ellipse cx="50" cy="50" rx="36" ry="16" stroke="#7c3aed" strokeWidth="2" />
      <ellipse cx="50" cy="50" rx="16" ry="36" stroke="#7c3aed" strokeWidth="2" />
      <line x1="50" y1="14" x2="50" y2="86" stroke="#7c3aed" strokeWidth="2" />
      <line x1="14" y1="50" x2="86" y2="50" stroke="#7c3aed" strokeWidth="2" />
      {/* Sparkles */}
      <path d="M85 20L87 26L93 28L87 30L85 36L83 30L77 28L83 26L85 20Z" fill="#7c3aed" />
      <path d="M15 70L16.5 74.5L21 76L16.5 77.5L15 82L13.5 77.5L9 76L13.5 74.5L15 70Z" fill="#7c3aed" />
    </svg>
  )
}

export function TornPaperDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 text-[#0c1220] fill-current"
      >
        <path d="M0,0 L20,18 L45,6 L70,22 L110,4 L145,26 L180,8 L220,24 L260,6 L300,28 L340,10 L380,26 L420,8 L460,24 L500,6 L540,26 L580,10 L620,28 L660,8 L700,24 L740,6 L780,26 L820,10 L860,28 L900,8 L940,24 L980,6 L1020,26 L1060,10 L1100,28 L1140,8 L1180,24 L1200,10 L1200,60 L0,60 Z" />
      </svg>
    </div>
  )
}

export function PhoneScanMockup({ className = '' }: { className?: string }) {
  return (
    <div className={`relative max-w-[270px] sm:max-w-[290px] mx-auto select-none ${className}`}>
      {/* Smartphone frame */}
      <div className="relative mx-auto w-[230px] sm:w-[250px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 h-4 w-20 bg-black rounded-full z-30" />

        {/* Screen */}
        <div className="relative bg-slate-900 rounded-[34px] overflow-hidden p-4 pt-10 text-center flex flex-col items-center justify-between min-h-[380px] border border-slate-800">
          
          {/* Camera Viewfinder Header */}
          <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono px-2 mb-2">
            <span>PHOTO</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          {/* QR Viewfinder Target Frame */}
          <div className="relative p-3.5 my-auto rounded-2xl bg-white shadow-lg border-2 border-slate-200">
            
            {/* Corner Viewfinder Crosshairs */}
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

            {/* Scanned QR Image */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900 fill-current">
              <rect x="10" y="10" width="25" height="25" rx="4" />
              <rect x="15" y="15" width="15" height="15" rx="2" fill="#fff" />
              <rect x="18" y="18" width="9" height="9" rx="1" />
              
              <rect x="65" y="10" width="25" height="25" rx="4" />
              <rect x="70" y="15" width="15" height="15" rx="2" fill="#fff" />
              <rect x="73" y="18" width="9" height="9" rx="1" />

              <rect x="10" y="65" width="25" height="25" rx="4" />
              <rect x="15" y="70" width="15" height="15" rx="2" fill="#fff" />
              <rect x="18" y="73" width="9" height="9" rx="1" />

              <rect x="42" y="12" width="6" height="6" rx="1" />
              <rect x="52" y="12" width="6" height="6" rx="1" />
              <rect x="42" y="24" width="6" height="6" rx="1" />
              <rect x="42" y="42" width="16" height="16" rx="3" fill="#7c3aed" />
              <rect x="65" y="42" width="6" height="6" rx="1" />
              <rect x="80" y="42" width="6" height="6" rx="1" />
              <rect x="65" y="55" width="10" height="6" rx="1" />
              <rect x="42" y="65" width="8" height="8" rx="1" />
              <rect x="55" y="75" width="10" height="6" rx="1" />
              <rect x="75" y="75" width="10" height="10" rx="1" />
            </svg>
          </div>

          {/* Prompt banner under scan */}
          <div className="w-full mt-3">
            <p className="text-white font-black text-xs sm:text-sm tracking-tight">
              Ready to create yours?
            </p>
            
            {/* Red curved arrow pointing up */}
            <div className="flex justify-center mt-1">
              <svg viewBox="0 0 40 30" fill="none" className="w-8 h-6 text-rose-500 stroke-current">
                <path d="M20 25C15 20 12 12 20 5" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M14 10L20 5L24 11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Decorative botanical shadow behind phone */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-yellow-300/40 blur-2xl -z-10" />
    </div>
  )
}


