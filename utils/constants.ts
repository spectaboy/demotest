export const winterSportsImages = [
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256",
    "https://images.unsplash.com/photo-1605540436563-5bca919ae766",
    "https://images.unsplash.com/photo-1565992441121-4367c2967103",
    "https://images.unsplash.com/photo-1612450622914-f0c1726daa80",
    "https://images.unsplash.com/photo-1613339027986-b94d85708995",
    "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd",
    "https://images.unsplash.com/photo-1616038242814-a6eac7845d88",
    "https://images.unsplash.com/photo-1518081461904-9d8f136351c2",
  ]
  
  export function getRandomProfileImage() {
    return winterSportsImages[Math.floor(Math.random() * winterSportsImages.length)]
  }
  
  export function isIphone() {
    return typeof window !== "undefined" && /iPhone/.test(navigator.userAgent)
  }
  
  export function getIphoneModel() {
    const width = typeof window !== "undefined" ? window.screen.width : 0
    const height = typeof window !== "undefined" ? window.screen.height : 0
  
    if (width === 390 && height === 844) return "iPhone 12, 13, 14"
    if (width === 428 && height === 926) return "iPhone 12 Pro Max, 13 Pro Max, 14 Plus"
    if (width === 375 && height === 812) return "iPhone X, XS, 11 Pro"
    if (width === 414 && height === 896) return "iPhone XR, XS Max, 11"
    if (width === 320 && height === 568) return "iPhone 5"
    if (width === 375 && height === 667) return "iPhone 6, 6S, 7, 8"
    if (width === 414 && height === 736) return "iPhone 6 Plus, 6S Plus, 7 Plus, 8 Plus"
    return "Unknown iPhone model"
  }
  
  