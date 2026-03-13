import sharp from 'sharp'

/**
 * 이미지 버퍼에 대각선 반복 워터마크를 합성해서 반환
 * @param imageBuffer - 원본 이미지 버퍼
 * @param text - 워터마크 텍스트 (기본: © KPOP STORE)
 * @param opacity - 투명도 0~1 (기본: 0.3)
 */
export async function applyWatermark(
  imageBuffer: ArrayBuffer,
  text: string = '© KPOP STORE',
  opacity: number = 0.3
): Promise<Buffer> {
  const buffer = Buffer.from(imageBuffer)

  // 원본 이미지 메타데이터 가져오기
  const metadata = await sharp(buffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 800

  // 대각선 반복 워터마크 SVG 생성
  const watermarkSvg = generateWatermarkSvg(width, height, text, opacity)
  const watermarkBuffer = Buffer.from(watermarkSvg)

  // 원본 이미지에 워터마크 합성
  const result = await sharp(buffer)
    .composite([
      {
        input: watermarkBuffer,
        tile: false,
        gravity: 'centre',
      },
    ])
    .jpeg({ quality: 85 })
    .toBuffer()

  return result
}

/**
 * 중앙 대각선 워터마크 SVG 생성
 */
function generateWatermarkSvg(
  width: number,
  height: number,
  text: string,
  opacity: number
): string {
  const fontSize = Math.max(18, Math.min(width, height) / 15)
  const cx = width / 2
  const cy = height / 2

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      <text
        x="${cx}"
        y="${cy}"
        font-size="${fontSize}"
        fill="white"
        fill-opacity="${opacity}"
        font-family="Arial, sans-serif"
        font-weight="bold"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(-35, ${cx}, ${cy})"
      >${text}</text>
    </svg>
  `
}
