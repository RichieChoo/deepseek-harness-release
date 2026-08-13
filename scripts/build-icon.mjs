import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const upstreamWordmark = 'https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/47f943859bef60e4160492346772ded9b24f765a/website/public/wordmark.svg'
const buildDirectory = new URL('../build/', import.meta.url)
const iconsetDirectory = new URL('../build/icon.iconset/', import.meta.url)
const startupBrand = new URL('../src/brand.png', import.meta.url)

await mkdir(iconsetDirectory, { recursive: true })
const response = await fetch(upstreamWordmark)
if (!response.ok) throw new Error(`Unable to download the pinned upstream wordmark: HTTP ${response.status}`)
const wordmark = Buffer.from(await response.arrayBuffer()).toString('base64')
const svg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect x="32" y="32" width="960" height="960" rx="220" fill="#fff"/>
    <image href="data:image/svg+xml;base64,${wordmark}" x="84" y="438" width="604" height="98"/>
    <rect x="710" y="444" width="230" height="86" rx="12" fill="#111"/>
    <text x="825" y="500" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif"
      font-size="36" font-weight="700" letter-spacing="1">HARNESS</text>
  </svg>
`)
const brandSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="120" viewBox="0 0 900 120">
    <image href="data:image/svg+xml;base64,${wordmark}" x="0" y="15" width="680" height="90"/>
    <rect x="700" y="20" width="200" height="80" rx="9" fill="#111"/>
    <text x="800" y="71" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif"
      font-size="31" font-weight="700" letter-spacing="1">HARNESS</text>
  </svg>
`)
await sharp(brandSvg, { density: 256 }).png().toFile(fileURLToPath(startupBrand))
const variants = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024]
]

for (const [name, size] of variants) {
  await sharp(svg, { density: 1024 })
    .resize(size, size)
    .png()
    .toFile(join(iconsetDirectory.pathname, name))
}

execFileSync('iconutil', ['--convert', 'icns', '--output', join(buildDirectory.pathname, 'icon.icns'), iconsetDirectory.pathname])
await rm(iconsetDirectory, { recursive: true })
