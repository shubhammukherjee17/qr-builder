import { MapProvider, LocationInputMode } from '@/types'

export const MAP_PROVIDERS = [
  { value: MapProvider.GEO, label: 'Universal (All Maps Apps)' },
  { value: MapProvider.GOOGLE, label: 'Google Maps' },
  { value: MapProvider.APPLE, label: 'Apple Maps' },
  { value: MapProvider.MAPPLS, label: 'Mappls (MapmyIndia)' },
  { value: MapProvider.OPENSTREETMAP, label: 'OpenStreetMap' },
  { value: MapProvider.BING, label: 'Bing Maps' },
  { value: MapProvider.WAZE, label: 'Waze' },
] as const

export interface ParsedMapLink {
  valid: boolean
  error?: string
  latitude?: string
  longitude?: string
  label?: string
  address?: string
  useOriginalUrl?: boolean
  originalUrl?: string
  detectedProvider?: MapProvider
}

function toString(value: string | boolean | undefined): string {
  return typeof value === 'string' ? value : ''
}

function parseCoordinate(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
}

export function isMapLink(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false

  try {
    const parsed = new URL(normalizeUrl(trimmed))
    const host = parsed.hostname.toLowerCase()
    const isGoogleMapsPath = parsed.pathname.includes('/maps')

    return (
      (host.includes('google') && (isGoogleMapsPath || host.includes('goo.gl'))) ||
      host.includes('goo.gl') ||
      host === 'maps.app.goo.gl' ||
      host.includes('maps.apple.com') ||
      host.includes('mappls.com') ||
      host.includes('openstreetmap.org') ||
      (host.includes('bing.com') && parsed.pathname.includes('/maps')) ||
      host.includes('waze.com') ||
      trimmed.startsWith('geo:')
    )
  } catch {
    return false
  }
}

function extractGooglePlaceName(pathname: string): string | undefined {
  const placeMatch = pathname.match(/\/maps\/place\/([^/@]+)/)
  if (!placeMatch) return undefined
  return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
}

function parseGoogleMapsLink(parsedUrl: URL, fullUrl: string): ParsedMapLink {
  const host = parsedUrl.hostname.toLowerCase()

  if (host.includes('goo.gl') || host === 'maps.app.goo.gl') {
    return {
      valid: true,
      useOriginalUrl: true,
      originalUrl: fullUrl,
      detectedProvider: MapProvider.GOOGLE,
    }
  }

  const preciseCoords = fullUrl.match(/!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/)
  if (preciseCoords) {
    return {
      valid: true,
      latitude: preciseCoords[1],
      longitude: preciseCoords[2],
      label: extractGooglePlaceName(parsedUrl.pathname),
      detectedProvider: MapProvider.GOOGLE,
    }
  }

  const atMatch = fullUrl.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/)
  if (atMatch) {
    return {
      valid: true,
      latitude: atMatch[1],
      longitude: atMatch[2],
      label: extractGooglePlaceName(parsedUrl.pathname),
      detectedProvider: MapProvider.GOOGLE,
    }
  }

  const q = parsedUrl.searchParams.get('q')
  if (q) {
    const decoded = decodeURIComponent(q.replace(/\+/g, ' '))
    const coordMatch = decoded.match(/^(-?\d+\.?\d+),\s*(-?\d+\.?\d+)$/)
    if (coordMatch) {
      return {
        valid: true,
        latitude: coordMatch[1],
        longitude: coordMatch[2],
        detectedProvider: MapProvider.GOOGLE,
      }
    }
    return { valid: true, address: decoded, detectedProvider: MapProvider.GOOGLE }
  }

  const query = parsedUrl.searchParams.get('query')
  if (query) {
    const decoded = decodeURIComponent(query)
    const coordMatch = decoded.match(/^(-?\d+\.?\d+),\s*(-?\d+\.?\d+)/)
    if (coordMatch) {
      const labelMatch = decoded.match(/^-?\d+\.?\d+,\s*-?\d+\.?\d+\s*\((.+)\)$/)
      return {
        valid: true,
        latitude: coordMatch[1],
        longitude: coordMatch[2],
        label: labelMatch?.[1],
        detectedProvider: MapProvider.GOOGLE,
      }
    }
    return { valid: true, address: decoded, detectedProvider: MapProvider.GOOGLE }
  }

  const placeName = extractGooglePlaceName(parsedUrl.pathname)
  if (placeName) {
    return { valid: true, address: placeName, detectedProvider: MapProvider.GOOGLE }
  }

  return {
    valid: true,
    useOriginalUrl: true,
    originalUrl: fullUrl,
    detectedProvider: MapProvider.GOOGLE,
  }
}

export function parseMapLink(url: string): ParsedMapLink {
  const trimmed = url.trim()
  if (!trimmed) {
    return { valid: false, error: 'Please paste a map link' }
  }

  if (trimmed.startsWith('geo:')) {
    const geoMatch = trimmed.match(/^geo:(-?\d+\.?\d*),(-?\d+\.?\d*)(?:\?q=(.+))?$/i)
    if (geoMatch) {
      return {
        valid: true,
        latitude: geoMatch[1],
        longitude: geoMatch[2],
        label: geoMatch[3] ? decodeURIComponent(geoMatch[3]) : undefined,
        detectedProvider: MapProvider.GEO,
      }
    }
    const geoAddressMatch = trimmed.match(/^geo:0,0\?q=(.+)$/i)
    if (geoAddressMatch) {
      return {
        valid: true,
        address: decodeURIComponent(geoAddressMatch[1]),
        detectedProvider: MapProvider.GEO,
      }
    }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(normalizeUrl(trimmed))
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }

  const host = parsedUrl.hostname.toLowerCase()
  const fullUrl = parsedUrl.href

  if (host.includes('google') || host.includes('goo.gl') || host === 'maps.app.goo.gl') {
    return parseGoogleMapsLink(parsedUrl, fullUrl)
  }

  if (host.includes('maps.apple.com')) {
    const llMatch = fullUrl.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (llMatch) {
      const labelMatch = fullUrl.match(/[?&]q=([^&]+)/)
      return {
        valid: true,
        latitude: llMatch[1],
        longitude: llMatch[2],
        label: labelMatch ? decodeURIComponent(labelMatch[1]) : undefined,
        detectedProvider: MapProvider.APPLE,
      }
    }
    const qMatch = fullUrl.match(/[?&]q=([^&]+)/)
    if (qMatch) {
      return {
        valid: true,
        address: decodeURIComponent(qMatch[1]),
        detectedProvider: MapProvider.APPLE,
      }
    }
  }

  if (host.includes('mappls.com')) {
    const pomMatch = fullUrl.match(/mappls\.com\/pom\/(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (pomMatch) {
      return {
        valid: true,
        latitude: pomMatch[1],
        longitude: pomMatch[2],
        detectedProvider: MapProvider.MAPPLS,
      }
    }
    const navMatch = fullUrl.match(/places=(-?\d+\.?\d*),(-?\d+\.?\d*),([^&]+)/)
    if (navMatch) {
      return {
        valid: true,
        latitude: navMatch[1],
        longitude: navMatch[2],
        label: decodeURIComponent(navMatch[3]),
        detectedProvider: MapProvider.MAPPLS,
      }
    }
  }

  if (isMapLink(trimmed)) {
    return { valid: true, useOriginalUrl: true, originalUrl: fullUrl }
  }

  return { valid: false, error: 'Unrecognized map link. Try a Google Maps share URL.' }
}

/** 
 * Universal geo: URI format — works on ALL devices and ALL maps apps.
 * The geo: URI scheme is supported by:
 * - iOS: Opens in Apple Maps, Google Maps, or user's default maps app
 * - Android: Opens in Google Maps, Waze, or user's default maps app
 * - Desktop: Falls back to Google Maps in browser
 * 
 * This is the MOST UNIVERSAL format for location QR codes.
 */
export function formatCrossPlatformMapsUrl(parsed: ParsedMapLink): string {
  // For coordinates, use geo: URI format - the true universal standard
  // Format: geo:latitude,longitude?q=label
  if (parsed.latitude && parsed.longitude) {
    const coords = `${parsed.latitude},${parsed.longitude}`
    
    // If we have a label (place name), include it as a query parameter
    if (parsed.label) {
      return `geo:${coords}?q=${encodeURIComponent(parsed.label)}`
    }
    
    // Without label, just coordinates
    return `geo:${coords}`
  }

  // For addresses or place names, use geo:0,0?q=address format
  // This tells devices to search for the location
  if (parsed.address) {
    return `geo:0,0?q=${encodeURIComponent(parsed.address)}`
  }

  // For shortened Google Maps links, keep original as fallback
  if (parsed.useOriginalUrl && parsed.originalUrl) {
    const url = parsed.originalUrl.toLowerCase()
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      return parsed.originalUrl
    }
  }

  // Fallback to original URL
  return parsed.originalUrl || ''
}

export function validateMapsInput(
  data: Record<string, string | boolean>
): { valid: boolean; error?: string } {
  const mode = (toString(data.locationMode) || 'link') as LocationInputMode

  if (mode === 'link') {
    const link = toString(data.mapLink).trim()
    if (!link) {
      return { valid: false, error: 'Please paste a Google Maps or map link' }
    }
    const parsed = parseMapLink(link)
    if (!parsed.valid) {
      return { valid: false, error: parsed.error || 'Could not parse map link' }
    }
    return { valid: true }
  }

  if (mode === 'address') {
    if (!toString(data.address).trim()) {
      return { valid: false, error: 'Please enter an address or place name' }
    }
    return { valid: true }
  }

  const lat = parseCoordinate(toString(data.latitude))
  const lng = parseCoordinate(toString(data.longitude))

  if (lat === null || lng === null) {
    return { valid: false, error: 'Please enter valid latitude and longitude' }
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' }
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' }
  }

  return { valid: true }
}

export function formatMapsUrl(data: Record<string, string | boolean>): string {
  const mode = (toString(data.locationMode) || 'link') as LocationInputMode

  if (mode === 'link') {
    const mapLink = toString(data.mapLink).trim()
    if (!mapLink) return ''
    const parsed = parseMapLink(mapLink)
    if (!parsed.valid) return ''
    return formatCrossPlatformMapsUrl(parsed)
  }

  const provider = (toString(data.mapProvider) || MapProvider.GOOGLE) as MapProvider
  const label = toString(data.label).trim()
  const zoom = Math.min(20, Math.max(1, parseInt(toString(data.zoom) || '16', 10) || 16))
  const address = toString(data.address).trim()

  if (mode === 'address') {
    return formatMapsAddressUrl(provider, address, label, zoom)
  }

  const lat = parseCoordinate(toString(data.latitude))
  const lng = parseCoordinate(toString(data.longitude))
  if (lat === null || lng === null) return ''

  return formatMapsCoordinateUrl(provider, lat, lng, label, zoom)
}

function formatMapsCoordinateUrl(
  provider: MapProvider,
  lat: number,
  lng: number,
  label: string,
  zoom: number
): string {
  const coords = `${lat},${lng}`

  switch (provider) {
    case MapProvider.GEO:
      // geo: URI - Universal format for all devices and apps
      return label
        ? `geo:${coords}?q=${encodeURIComponent(label)}`
        : `geo:${coords}`

    case MapProvider.GOOGLE:
      // For manual coordinate entry with Google provider, use geo: for universality
      return label
        ? `geo:${coords}?q=${encodeURIComponent(label)}`
        : `geo:${coords}`

    case MapProvider.APPLE:
      if (label) {
        return `https://maps.apple.com/?ll=${coords}&q=${encodeURIComponent(label)}`
      }
      return `https://maps.apple.com/?ll=${coords}`

    case MapProvider.MAPPLS:
      if (label) {
        return `https://mappls.com/navigation?places=${lat},${lng},${encodeURIComponent(label)}&isNav=false`
      }
      return `https://mappls.com/pom/${lat},${lng}`

    case MapProvider.OPENSTREETMAP:
      return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`

    case MapProvider.BING:
      if (label) {
        return `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=${zoom}&sp=point.${lat}_${lng}_${encodeURIComponent(label)}`
      }
      return `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=${zoom}`

    case MapProvider.WAZE:
      return `https://www.waze.com/ul?ll=${coords}&navigate=yes`

    default:
      // Default to universal geo: URI
      return label
        ? `geo:${coords}?q=${encodeURIComponent(label)}`
        : `geo:${coords}`
  }
}

function formatMapsAddressUrl(
  provider: MapProvider,
  address: string,
  label: string,
  zoom: number
): string {
  const query = label || address
  const encodedQuery = encodeURIComponent(query)
  const encodedAddress = encodeURIComponent(address)

  switch (provider) {
    case MapProvider.GEO:
      // geo: URI - Universal format for all devices
      return `geo:0,0?q=${encodedQuery}`

    case MapProvider.GOOGLE:
      // Use geo: URI for maximum universality - works with any maps app
      return `geo:0,0?q=${encodedAddress}`

    case MapProvider.APPLE:
      return `https://maps.apple.com/?q=${encodedAddress}`

    case MapProvider.MAPPLS:
      return `https://www.mappls.com/search/${encodedAddress}`

    case MapProvider.OPENSTREETMAP:
      return `https://www.openstreetmap.org/search?query=${encodedAddress}`

    case MapProvider.BING:
      return `https://www.bing.com/maps?q=${encodedAddress}&lvl=${zoom}`

    case MapProvider.WAZE:
      return `https://www.waze.com/ul?q=${encodedAddress}&navigate=yes`

    default:
      // Default to universal geo: URI
      return `geo:0,0?q=${encodedAddress}`
  }
}

export function parseMapsUrl(content: string): Record<string, string | boolean> {
  if (content.includes('google.com/maps') || content.includes('goo.gl')) {
    const parsed = parseMapLink(content)
    if (parsed.valid) {
      return {
        locationMode: 'link',
        mapLink: content,
        mapProvider: MapProvider.GOOGLE,
        ...(parsed.latitude && { latitude: parsed.latitude }),
        ...(parsed.longitude && { longitude: parsed.longitude }),
        ...(parsed.label && { label: parsed.label }),
        ...(parsed.address && { address: parsed.address }),
      }
    }
  }

  const geoMatch = content.match(/^geo:(-?\d+\.?\d*),(-?\d+\.?\d*)(?:\?q=(.+))?$/i)
  if (geoMatch) {
    return {
      mapProvider: MapProvider.GEO,
      locationMode: 'coordinates',
      latitude: geoMatch[1],
      longitude: geoMatch[2],
      label: decodeURIComponent(geoMatch[3] || ''),
    }
  }

  const geoAddressMatch = content.match(/^geo:0,0\?q=(.+)$/i)
  if (geoAddressMatch) {
    return {
      mapProvider: MapProvider.GEO,
      locationMode: 'address',
      address: decodeURIComponent(geoAddressMatch[1]),
    }
  }

  if (content.includes('maps.apple.com')) {
    const llMatch = content.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (llMatch) {
      const labelMatch = content.match(/[?&]q=([^&]+)/)
      return {
        mapProvider: MapProvider.APPLE,
        locationMode: 'coordinates',
        latitude: llMatch[1],
        longitude: llMatch[2],
        label: labelMatch ? decodeURIComponent(labelMatch[1]) : '',
      }
    }
    const qMatch = content.match(/[?&]q=([^&]+)/)
    return {
      mapProvider: MapProvider.APPLE,
      locationMode: 'address',
      address: qMatch ? decodeURIComponent(qMatch[1]) : '',
    }
  }

  if (content.includes('mappls.com')) {
    const pomMatch = content.match(/mappls\.com\/pom\/(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (pomMatch) {
      return {
        mapProvider: MapProvider.MAPPLS,
        locationMode: 'coordinates',
        latitude: pomMatch[1],
        longitude: pomMatch[2],
      }
    }
    const navMatch = content.match(/places=(-?\d+\.?\d*),(-?\d+\.?\d*),([^&]+)/)
    if (navMatch) {
      return {
        mapProvider: MapProvider.MAPPLS,
        locationMode: 'coordinates',
        latitude: navMatch[1],
        longitude: navMatch[2],
        label: decodeURIComponent(navMatch[3]),
      }
    }
  }

  return { locationMode: 'link', mapLink: content, mapProvider: MapProvider.GOOGLE }
}
