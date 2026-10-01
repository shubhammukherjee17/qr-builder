import QRCode from 'qrcode'
import { QRCodeStyle } from '@/types'

/**
 * Checks if a module at (row, col) is part of one of the three 7x7 corner finder patterns.
 */
export function isFinderPattern(row: number, col: number, matrixSize: number): boolean {
  // Top-left finder pattern: [0..6, 0..6]
  if (row < 7 && col < 7) return true
  // Top-right finder pattern: [0..6, (size-7)..size-1]
  if (row < 7 && col >= matrixSize - 7) return true
  // Bottom-left finder pattern: [(size-7)..size-1, 0..6]
  if (row >= matrixSize - 7 && col < 7) return true
  return false
}

export interface RenderQROptions {
  content: string
  style: QRCodeStyle
  canvas: HTMLCanvasElement
  logoImage?: HTMLImageElement | null
}

/**
 * High-performance, pixel-perfect QR Code renderer for HTML5 Canvas.
 * Supports custom module dot styles (square, rounded, dots), custom corner eye styles,
 * gradients (linear, radial), and center logo embedding with auto-cutout.
 */
export async function renderQRCodeToCanvas({
  content,
  style,
  canvas,
  logoImage,
}: RenderQROptions): Promise<void> {
  const text = content.trim() || 'https://qrbuilder.io'
  
  // If logo is present, use at least 'Q' or 'H' error correction so the QR code remains scannable
  const errorLevel = logoImage ? 'H' : (style.errorCorrectionLevel || 'M')
  
  const qr = QRCode.create(text, {
    errorCorrectionLevel: errorLevel,
  })

  const matrixSize = qr.modules.size
  const canvasSize = style.size || 512
  const marginModules = typeof style.margin === 'number' ? style.margin : 2
  
  // Total modules including margins
  const totalModules = matrixSize + marginModules * 2
  const moduleSize = canvasSize / totalModules

  canvas.width = canvasSize
  canvas.height = canvasSize

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Draw Background
  ctx.fillStyle = style.backgroundColor || '#ffffff'
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  // 2. Prepare Foreground Paint (Solid or Gradient)
  let fillPaint: string | CanvasGradient = style.foregroundColor || '#000000'
  if (style.gradientType === 'linear' && style.gradientColor) {
    const grad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize)
    grad.addColorStop(0, style.foregroundColor || '#000000')
    grad.addColorStop(1, style.gradientColor)
    fillPaint = grad
  } else if (style.gradientType === 'radial' && style.gradientColor) {
    const half = canvasSize / 2
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
    grad.addColorStop(0, style.foregroundColor || '#000000')
    grad.addColorStop(1, style.gradientColor)
    fillPaint = grad
  }

  // 3. Define Center Logo Exclusion Zone (if logo present)
  let logoCutoutRadius = 0
  const centerCoord = canvasSize / 2
  if (logoImage) {
    const logoDisplaySize = style.logoSize || Math.floor(canvasSize * 0.22)
    logoCutoutRadius = (logoDisplaySize / 2) + 6
  }

  // 4. Draw Corner Finder Eyes (the three 7x7 corner squares)
  const drawCornerEye = (startRow: number, startCol: number) => {
    const x = (startCol + marginModules) * moduleSize
    const y = (startRow + marginModules) * moduleSize
    const outerSize = 7 * moduleSize
    const innerSize = 3 * moduleSize
    const cornerStyle = style.cornerStyle || 'square'

    ctx.save()
    ctx.fillStyle = fillPaint

    // Outer ring
    ctx.beginPath()
    if (cornerStyle === 'rounded') {
      ctx.roundRect(x, y, outerSize, outerSize, moduleSize * 1.5)
      // Cut out the inner white area
      ctx.roundRect(x + moduleSize, y + moduleSize, outerSize - 2 * moduleSize, outerSize - 2 * moduleSize, moduleSize * 0.75)
    } else if (cornerStyle === 'extra-rounded') {
      ctx.roundRect(x, y, outerSize, outerSize, outerSize / 2)
      ctx.roundRect(x + moduleSize, y + moduleSize, outerSize - 2 * moduleSize, outerSize - 2 * moduleSize, (outerSize - 2 * moduleSize) / 2)
    } else {
      // Square
      ctx.rect(x, y, outerSize, outerSize)
      ctx.rect(x + moduleSize, y + moduleSize, outerSize - 2 * moduleSize, outerSize - 2 * moduleSize)
    }
    ctx.fill('evenodd')

    // Inner center dot
    const innerX = x + 2 * moduleSize
    const innerY = y + 2 * moduleSize
    ctx.beginPath()
    if (cornerStyle === 'rounded') {
      ctx.roundRect(innerX, innerY, innerSize, innerSize, moduleSize * 0.8)
    } else if (cornerStyle === 'extra-rounded') {
      ctx.roundRect(innerX, innerY, innerSize, innerSize, innerSize / 2)
    } else {
      ctx.rect(innerX, innerY, innerSize, innerSize)
    }
    ctx.fill()
    ctx.restore()
  }

  // Draw the 3 finder eyes
  drawCornerEye(0, 0)
  drawCornerEye(0, matrixSize - 7)
  drawCornerEye(matrixSize - 7, 0)

  // 5. Draw regular data modules
  ctx.save()
  ctx.fillStyle = fillPaint
  const dotStyle = style.dotStyle || 'square'

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder pattern zones (drawn separately)
      if (isFinderPattern(r, c, matrixSize)) continue

      if (qr.modules.get(r, c)) {
        const x = (c + marginModules) * moduleSize
        const y = (r + marginModules) * moduleSize
        const modCenterDist = Math.hypot(x + moduleSize / 2 - centerCoord, y + moduleSize / 2 - centerCoord)

        // If covered by logo cutout, skip
        if (logoCutoutRadius > 0 && modCenterDist < logoCutoutRadius) {
          continue
        }

        ctx.beginPath()
        if (dotStyle === 'dots') {
          // Circular dot
          const radius = (moduleSize / 2) * 0.88
          ctx.arc(x + moduleSize / 2, y + moduleSize / 2, radius, 0, Math.PI * 2)
          ctx.fill()
        } else if (dotStyle === 'rounded') {
          // Smooth rounded rectangle
          const radius = moduleSize * 0.35
          ctx.roundRect(x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, radius)
          ctx.fill()
        } else {
          // Standard square
          ctx.fillRect(x, y, moduleSize, moduleSize)
        }
      }
    }
  }
  ctx.restore()

  // 6. Draw Center Logo (if provided)
  if (logoImage) {
    const logoSize = style.logoSize || Math.floor(canvasSize * 0.22)
    const badgeSize = logoSize + 12
    const badgeX = centerCoord - badgeSize / 2
    const badgeY = centerCoord - badgeSize / 2

    ctx.save()
    // White background badge with soft border
    ctx.fillStyle = style.backgroundColor || '#ffffff'
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, badgeSize * 0.25)
    ctx.fill()

    ctx.strokeStyle = 'rgba(0,0,0,0.06)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Draw logo centered inside badge
    const imgX = centerCoord - logoSize / 2
    const imgY = centerCoord - logoSize / 2
    
    // Clip logo with rounded corners
    ctx.beginPath()
    ctx.roundRect(imgX, imgY, logoSize, logoSize, logoSize * 0.2)
    ctx.clip()
    ctx.drawImage(logoImage, imgX, imgY, logoSize, logoSize)
    ctx.restore()
  }
}
