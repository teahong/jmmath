export function useVisionRecognizer() {
  return {
    recognizer: { provider: 'google-vision' },
    status: 'ready',
    error: ''
  }
}

export async function recognizeAnswer(recognizer, canvas) {
  if (!recognizer) {
    throw new Error('Google Vision 인식기가 준비되지 않았어요.')
  }

  const images = canvasToVisionImages(canvas)
  const response = await fetch('/api/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ images })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error ?? 'Google Vision 인식에 실패했어요.')
  }

  return data
}

function canvasToVisionImages(canvas) {
  const sourceCtx = canvas.getContext('2d', { willReadFrequently: true })
  const image = sourceCtx.getImageData(0, 0, canvas.width, canvas.height)
  const bounds = getInkBounds(image)
  const crop = bounds ?? {
    minX: 0,
    minY: 0,
    maxX: canvas.width - 1,
    maxY: canvas.height - 1
  }

  return [
    renderVisionImage(canvas, crop, { scale: 6, padding: 160, threshold: true, square: true }),
    renderVisionImage(canvas, crop, { scale: 5, padding: 120, threshold: true, square: false }),
    renderVisionImage(canvas, crop, { scale: 4, padding: 96, threshold: false, square: true })
  ]
}

function renderVisionImage(canvas, crop, options) {
  const { scale, padding, threshold, square } = options
  const width = crop.maxX - crop.minX + 1
  const height = crop.maxY - crop.minY + 1
  const side = Math.max(width, height)
  const targetWidth = (square ? side : width) * scale + padding * 2
  const targetHeight = (square ? side : height) * scale + padding * 2
  const offsetX = square ? ((side - width) * scale) / 2 : 0
  const offsetY = square ? ((side - height) * scale) / 2 : 0

  const target = document.createElement('canvas')
  target.width = targetWidth
  target.height = targetHeight

  const ctx = target.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, target.width, target.height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const destinationX = padding + offsetX
  const destinationY = padding + offsetY

  if (threshold) {
    ctx.drawImage(
      canvas,
      crop.minX,
      crop.minY,
      width,
      height,
      destinationX - 2,
      destinationY,
      width * scale,
      height * scale
    )
    ctx.drawImage(
      canvas,
      crop.minX,
      crop.minY,
      width,
      height,
      destinationX + 2,
      destinationY,
      width * scale,
      height * scale
    )
  }

  ctx.drawImage(
    canvas,
    crop.minX,
    crop.minY,
    width,
    height,
    destinationX,
    destinationY,
    width * scale,
    height * scale
  )

  if (threshold) {
    makeHighContrast(target)
  }

  return target.toDataURL('image/png')
}

function makeHighContrast(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < image.data.length; index += 4) {
    const red = image.data[index]
    const green = image.data[index + 1]
    const blue = image.data[index + 2]
    const alpha = image.data[index + 3]
    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue
    const ink = alpha > 10 && luminance < 248
    image.data[index] = ink ? 0 : 255
    image.data[index + 1] = ink ? 0 : 255
    image.data[index + 2] = ink ? 0 : 255
    image.data[index + 3] = 255
  }

  ctx.putImageData(image, 0, 0)
}

function getInkBounds(image) {
  const { data, width, height } = image
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4
      if (data[index] < 245 || data[index + 1] < 245 || data[index + 2] < 245) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  if (minX > maxX || minY > maxY) return null
  return { minX, minY, maxX, maxY }
}
