import { NextRequest, NextResponse } from 'next/server'
import { applyWatermark } from '@/lib/watermark'
import * as https from 'https'
import * as http from 'http'

const WATERMARK_TEXT = process.env.WATERMARK_TEXT || '© K-STORM'

// zerowin.tplinkdns.com → 로컬 IP로 직접 접근 (헤어핀 NAT 우회)
const LOCAL_HOST = process.env.KPOP_LOCAL_HOST || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const encoded = searchParams.get('u')

  if (!encoded) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  try {
    const imageUrl = Buffer.from(encoded, 'base64').toString('utf-8').replace(/�/g, '').trim()

    const imageBuffer = await fetchImage(imageUrl)
    const watermarked = await applyWatermark(imageBuffer, WATERMARK_TEXT, 0.3)

    return new NextResponse(new Uint8Array(watermarked), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Image error:', error)
    return placeholderResponse()
  }
}

function fetchImage(imageUrl: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    // LOCAL_HOST가 설정된 경우 도메인 대신 직접 IP 접근
    let targetUrl = imageUrl
    if (LOCAL_HOST && imageUrl.includes('zerowin.tplinkdns.com')) {
      targetUrl = imageUrl.replace('zerowin.tplinkdns.com', LOCAL_HOST)
    }

    const parsedUrl = new URL(targetUrl)
    const isHttps = parsedUrl.protocol === 'https:'
    const lib = isHttps ? https : http

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      rejectUnauthorized: false, // 로컬 SSL 인증서 문제 우회
      headers: {
        'Host': 'zerowin.tplinkdns.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'http://zerowin.tplinkdns.com/',
      },
    }

    const req = lib.request(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location
        if (location) {
          const absolute = location.startsWith('http') ? location : `${parsedUrl.protocol}//${parsedUrl.hostname}${location}`
          fetchImage(absolute).then(resolve).catch(reject)
          return
        }
      }
      if (!res.statusCode || res.statusCode >= 400) {
        const bodyChunks: Buffer[] = []
        res.on('data', (c: Buffer) => bodyChunks.push(c))
        res.on('end', () => {
          const body = Buffer.concat(bodyChunks).toString('utf-8').slice(0, 300)
          console.error(`upstream ${res.statusCode} for ${imageUrl}`)
          console.error(`  server=${res.headers['server']} content-type=${res.headers['content-type']}`)
          console.error(`  body: ${body}`)
          reject(new Error(`Upstream ${res.statusCode}`))
        })
        return
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        const buf = Buffer.concat(chunks)
        resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer)
      })
      res.on('error', reject)
    })

    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')) })
    req.end()
  })
}

function placeholderResponse() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
    <rect width="300" height="400" fill="#e2e8f0"/>
    <rect x="100" y="140" width="100" height="80" rx="8" fill="#cbd5e1"/>
    <circle cx="125" cy="165" r="12" fill="#94a3b8"/>
    <path d="M100 200 l30-30 20 20 30-40 20 50z" fill="#94a3b8"/>
    <text x="150" y="270" font-family="Arial" font-size="13" fill="#94a3b8" text-anchor="middle">이미지 없음</text>
  </svg>`
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
