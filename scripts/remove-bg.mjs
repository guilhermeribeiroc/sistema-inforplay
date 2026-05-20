import sharp from 'sharp'

const { data, info } = await sharp('public/logo.png')
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = new Uint8Array(data)

// Sample background color from top-left corner
const bgR = pixels[0], bgG = pixels[1], bgB = pixels[2]
console.log(`Background color sampled: rgb(${bgR}, ${bgG}, ${bgB})`)

const threshold = 40

for (let i = 0; i < pixels.length; i += channels) {
  const r = pixels[i], g = pixels[i+1], b = pixels[i+2]
  const dist = Math.sqrt((r-bgR)**2 + (g-bgG)**2 + (b-bgB)**2)
  if (dist < threshold) {
    pixels[i+3] = 0 // make transparent
  }
}

await sharp(Buffer.from(pixels), { raw: { width, height, channels } })
  .png()
  .toFile('public/logo.png')

console.log('Done! Background removed.')
