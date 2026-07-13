import * as https from 'https'
import * as http from 'http'

const LOCAL_HOST = process.env.KPOP_LOCAL_HOST || ''

export function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  if (!LOCAL_HOST) return fetch(url, init)

  try {
    const parsed = new URL(url)
    if (parsed.hostname === LOCAL_HOST) return fetch(url, init)

    const originalHostname = parsed.hostname
    parsed.hostname = LOCAL_HOST
    return nodeRequest(parsed.toString(), originalHostname)
  } catch {
    return fetch(url, init)
  }
}

function nodeRequest(url: string, hostHeader: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const isHttps = parsed.protocol === 'https:'
    const lib = isHttps ? https : http

    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
        'Host': hostHeader,
        'Accept': 'application/json',
      },
    }

    const req = lib.request(options, (res) => {
      if (res.statusCode && [301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const location = res.headers.location
        let redirectUrl = location.startsWith('http')
          ? location
          : `${parsed.protocol}//${parsed.hostname}${location}`
        // 리다이렉트 URL에 원래 도메인이 포함되어 있으면 다시 LOCAL_HOST로 교체
        if (redirectUrl.includes(hostHeader)) {
          const r = new URL(redirectUrl)
          r.hostname = LOCAL_HOST
          redirectUrl = r.toString()
        }
        nodeRequest(redirectUrl, hostHeader).then(resolve).catch(reject)
        return
      }

      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        const body = Buffer.concat(chunks)
        resolve(new Response(body, {
          status: res.statusCode ?? 200,
          headers: new Headers(
            Object.entries(res.headers)
              .filter(([, v]) => v != null)
              .map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : String(v)])
          ),
        }))
      })
      res.on('error', reject)
    })

    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')) })
    req.end()
  })
}
