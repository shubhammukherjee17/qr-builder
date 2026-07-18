# Universal Location QR Code - Maximum Compatibility

## Overview
This QR code generator creates **universal location QR codes** using the `geo:` URI format that work with **ANY maps app** on your device:
- ✅ **iOS** - Opens in Apple Maps, Google Maps, Waze, or user's preferred maps app
- ✅ **Android** - Opens in Google Maps, Waze, or user's preferred maps app
- ✅ **Desktop** - Opens user's default maps application or browser

## Why geo: URI? 🌍

### The Universal Standard
The `geo:` URI scheme (RFC 5870) is an **international standard** for geographic locations. It's like `mailto:` for email - every device knows how to handle it.

### Key Benefits
1. **User Choice** - Opens in the user's preferred maps app, not forced to one service
2. **Works Everywhere** - iOS, Android, Windows, Mac, Linux all support it
3. **No Internet Required** - Works offline with downloaded maps
4. **Privacy Friendly** - No tracking, no redirects through third-party servers
5. **Future Proof** - International standard, won't break when services change

## Format Examples

### Coordinates with Label
```
geo:28.6139,77.2090?q=India Gate, New Delhi
```
**Opens to:** India Gate location with pin and label

### Coordinates Only
```
geo:40.7128,-74.0060
```
**Opens to:** Exact coordinates (New York City)

### Search by Address
```
geo:0,0?q=Eiffel Tower, Paris
```
**Opens to:** Search for Eiffel Tower, device finds the location

## Supported Input Formats

### 1. **Paste Google Maps Links** (Auto-converts)
Paste any of these formats - automatically converts to universal geo: URI:
- Full URLs: `https://www.google.com/maps/place/India+Gate/@28.612912,77.2295107,17z`
- Short links: `https://goo.gl/maps/abc123`
- App links: `https://maps.app.goo.gl/xyz789`

### 2. **Manual Entry**
- **Coordinates**: `28.612912, 77.2295107`
- **Addresses**: "India Gate, New Delhi"
- **Place Names**: "Taj Mahal"

## How Different Devices Handle geo: URIs

### iOS Behavior
1. **Default**: Opens in Apple Maps
2. **With Google Maps installed**: User can choose Google Maps
3. **With Waze installed**: User can choose Waze
4. **Fallback**: Safari with map search

### Android Behavior
1. **Default**: Opens in Google Maps
2. **With Waze installed**: User can choose Waze
3. **With other apps**: Any map app that registered for geo: URIs
4. **Fallback**: Chrome with map search

### Desktop Behavior
1. **Windows**: Opens default maps app or browser
2. **Mac**: Opens Apple Maps or browser
3. **Linux**: Opens browser with map search

## Comparison: geo: vs HTTPS URLs

| Feature | geo: URI | Google Maps URL | Apple Maps URL |
|---------|----------|-----------------|----------------|
| **iOS Support** | ✅ Native | ⚠️ Needs app | ✅ Native |
| **Android Support** | ✅ Native | ✅ Native | ❌ Limited |
| **User Choice** | ✅ Yes | ❌ No | ❌ No |
| **Offline Maps** | ✅ Yes | ❌ No | ✅ Yes |
| **Privacy** | ✅ High | ⚠️ Medium | ✅ High |
| **Universal** | ✅ Yes | ⚠️ Partial | ❌ iOS only |

## Real-World Examples

### Example 1: Tourist Attraction
**Input:** Paste `https://www.google.com/maps/place/Taj+Mahal/@27.1751,78.0421,17z`
**QR Output:** `geo:27.1751,78.0421?q=Taj Mahal`
**Result:** 
- Tourist with Apple Maps → Opens in Apple Maps
- Tourist with Google Maps → Opens in Google Maps
- Tourist with no app → Opens in browser

### Example 2: Restaurant Location
**Input:** Enter coordinates `40.7589,-73.9851` with label "Times Square"
**QR Output:** `geo:40.7589,-73.9851?q=Times Square`
**Result:** Everyone sees "Times Square" in their preferred maps app

### Example 3: Delivery Address
**Input:** Enter address "1600 Amphitheatre Parkway, Mountain View"
**QR Output:** `geo:0,0?q=1600 Amphitheatre Parkway, Mountain View`
**Result:** Delivery driver's navigation app (Waze/Google/Apple) opens directly

## Technical Specification (RFC 5870)

### Standard Format
```
geo:latitude,longitude[,altitude][;crs=...][;u=...]?query
```

### Our Implementation
We use the simplified format that all devices support:
```
geo:lat,lng?q=label          # Coordinates with label
geo:lat,lng                  # Coordinates only
geo:0,0?q=address           # Address search
```

### Why Not Use Full Spec?
- `altitude` - Not widely supported by map apps
- `crs` (coordinate system) - Default WGS-84 is universal
- `u` (uncertainty) - Not used by consumer map apps

## Browser/App Support Matrix

| Platform | Default Handler | Alternative Apps | Notes |
|----------|----------------|------------------|-------|
| iPhone (iOS 16+) | Apple Maps | Google Maps, Waze | System prompt for choice |
| Android 10+ | Google Maps | Waze, HERE, etc. | System prompt for choice |
| iPad | Apple Maps | Same as iPhone | - |
| Mac (Safari) | Apple Maps | - | Opens native app |
| Windows | Browser | Google Maps web | Opens maps.google.com |
| Linux | Browser | - | Opens maps.google.com |

## Testing Your QR Codes

### Quick Test Checklist

✅ **iOS Device (iPhone/iPad)**
1. Scan QR with Camera app
2. Expected: Notification appears
3. Tap notification
4. Expected: "Open in Maps" or app chooser

✅ **Android Device**
1. Scan QR with Camera or Google Lens
2. Expected: Preview appears
3. Tap to open
4. Expected: Google Maps opens (or app chooser)

✅ **Desktop Browser**
1. Scan with phone
2. Expected: Opens map in mobile browser or app

### What Success Looks Like
- ✅ No "app not found" errors
- ✅ Location shows correctly
- ✅ User can get directions immediately
- ✅ Works in offline maps (if downloaded)

## Migration from Old Format

If you previously used `google.com/maps` URLs:

**Old:**
```
https://www.google.com/maps/search/?api=1&query=28.6139,77.2090
```

**New (Universal):**
```
geo:28.6139,77.2090
```

**Benefits:**
- 75% shorter URL = simpler QR code = easier to scan
- Works with all apps, not just Google Maps
- No internet required if maps are cached
- Better privacy (no Google tracking)

## Advanced Features

### Multiple Map Providers
Users can still choose specific providers manually:
- **Universal (Recommended)** - Uses geo: URI
- **Google Maps** - Uses geo: URI (opens in Google Maps on Android)
- **Apple Maps** - Uses https://maps.apple.com (iOS only)
- **Waze** - Uses https://waze.com (for navigation)
- **OpenStreetMap** - Uses https://osm.org (open source)

### When to Use Specific Providers

**Use Universal (geo:) when:**
- ✅ General public QR codes
- ✅ Tourist attractions
- ✅ Business locations
- ✅ Event venues

**Use specific provider when:**
- 🎯 You NEED Waze for navigation (trucking/delivery)
- 🎯 OSM for open-source requirements
- 🎯 Apple Maps for iOS-exclusive apps

## Implementation Files

- `src/lib/maps-utils.ts` - Core URL formatting with geo: URI
- `src/components/QRBuilder.tsx` - Auto-generation on paste
- `src/lib/qr-utils.ts` - QR code generation

## References

- [RFC 5870 - geo URI Scheme](https://tools.ietf.org/html/rfc5870)
- [IANA URI Schemes Registry](https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml)
- [Apple URL Scheme Reference](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/)
- [Android Intent Documentation](https://developer.android.com/guide/components/intents-common#Maps)

## FAQ

**Q: Will this work on old phones?**
A: Yes! geo: URIs have been supported since iOS 6 (2012) and Android 2.3 (2011).

**Q: What if someone doesn't have any maps app?**
A: It opens in their mobile browser with a web-based map.

**Q: Does this work offline?**
A: Yes, if the user has downloaded maps in their maps app.

**Q: Can I still use Google Maps specifically?**
A: Yes, but geo: URI on Android will open Google Maps by default anyway. On iOS, it gives users choice.

**Q: Is this GDPR compliant?**
A: Yes, geo: URIs don't send data to third parties. More privacy-friendly than HTTPS redirects.

---

**Built with ❤️ for universal compatibility**
