import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const upstreamIcon = 'https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/47f943859bef60e4160492346772ded9b24f765a/apps/web/public/favicon.svg'
const buildDirectory = new URL('../build/', import.meta.url)
const iconsetDirectory = new URL('../build/icon.iconset/', import.meta.url)

await mkdir(iconsetDirectory, { recursive: true })
const response = await fetch(upstreamIcon)
if (!response.ok) throw new Error(`Unable to download the pinned upstream icon: HTTP ${response.status}`)
const svg = Buffer.from(await response.arrayBuffer())
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
