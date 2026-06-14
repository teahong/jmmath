import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { recognizeDigitsFromImage } from './api/vision.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.GOOGLE_VISION_API_KEY = env.GOOGLE_VISION_API_KEY ?? process.env.GOOGLE_VISION_API_KEY
  process.env.GOOGLE_CLOUD_VISION_API_KEY =
    env.GOOGLE_CLOUD_VISION_API_KEY ?? process.env.GOOGLE_CLOUD_VISION_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'jmmath-google-vision-api',
        configureServer(server) {
          server.middlewares.use('/api/recognize', async (request, response) => {
            if (request.method !== 'POST') {
              response.statusCode = 405
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ error: 'Only POST requests are supported.' }))
              return
            }

            try {
              const chunks = []
              for await (const chunk of request) {
                chunks.push(chunk)
              }
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
              const result = await recognizeDigitsFromImage(body)
              response.statusCode = 200
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify(result))
            } catch (error) {
              response.statusCode = error.statusCode ?? 500
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ error: error.message ?? '숫자 인식 중 오류가 발생했어요.' }))
            }
          })
        }
      }
    ]
  }
})
