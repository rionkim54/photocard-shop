const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function imgSrc(imageUrl: string | null | undefined) {
  if (!imageUrl) return ''
  const clean = imageUrl.replace(/�/g, '').trim()
  const encoded = btoa(unescape(encodeURIComponent(clean)))
  return `${BASE_PATH}/api/image?u=${encodeURIComponent(encoded)}`
}
