const VISION_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate'

export async function recognizeDigitsFromImage(body) {
  const apiKey = (process.env.GOOGLE_VISION_API_KEY ?? process.env.GOOGLE_CLOUD_VISION_API_KEY ?? '').trim()
  if (!apiKey) {
    throw createHttpError(500, 'GOOGLE_VISION_API_KEY 환경 변수가 필요해요.')
  }

  const images = Array.isArray(body?.images) ? body.images : [body?.image]
  const contents = images
    .filter((image) => typeof image === 'string')
    .map((image) => image.replace(/^data:image\/\w+;base64,/, ''))
    .filter(Boolean)

  if (contents.length === 0) {
    throw createHttpError(400, '인식할 이미지가 비어 있어요.')
  }

  const visionResponse = await fetch(`${VISION_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: contents.flatMap((content) => [
        createVisionRequest(content, 'TEXT_DETECTION'),
        createVisionRequest(content, 'DOCUMENT_TEXT_DETECTION')
      ])
    })
  })

  const data = await visionResponse.json()
  if (!visionResponse.ok) {
    throw createHttpError(visionResponse.status, data?.error?.message ?? 'Google Vision API 호출에 실패했어요.')
  }

  const annotations = data.responses ?? []
  const failed = annotations.find((annotation) => annotation?.error)
  if (failed) {
    throw createHttpError(502, failed.error.message ?? 'Google Vision이 이미지를 읽지 못했어요.')
  }

  const candidates = annotations
    .flatMap((annotation) => [annotation?.textAnnotations?.[0]?.description, annotation?.fullTextAnnotation?.text])
    .filter(Boolean)
    .map((rawText) => ({
      rawText,
      text: rawText.replace(/[^\d]/g, '')
    }))

  const candidate = candidates.find((item) => item.text)
  if (!candidate) {
    throw createHttpError(422, 'Google Vision이 응답했지만 숫자를 찾지 못했어요. 숫자를 더 크게 쓰고 주변 여백을 조금 남겨주세요.')
  }

  return {
    text: candidate.text,
    value: Number(candidate.text),
    confidence: 1,
    provider: 'google-vision',
    rawText: candidate.rawText
  }
}

function createVisionRequest(content, type) {
  return {
    image: { content },
    features: [{ type, maxResults: 5 }],
    imageContext: {
      languageHints: ['en']
    }
  }
}

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}
