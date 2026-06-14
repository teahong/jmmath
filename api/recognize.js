import { recognizeDigitsFromImage } from './vision.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ error: 'Only POST requests are supported.' })
    return
  }

  try {
    const result = await recognizeDigitsFromImage(request.body)
    response.status(200).json(result)
  } catch (error) {
    response.status(error.statusCode ?? 500).json({
      error: error.message ?? '숫자 인식 중 오류가 발생했어요.'
    })
  }
}
