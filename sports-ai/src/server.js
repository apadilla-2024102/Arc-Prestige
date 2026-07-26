import 'dotenv/config'
import { getSportsAiAnswer } from './config/ai.js'
import http from 'node:http'

const PORT = process.env.PORT || 4000
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function sendJson(res, status, payload) {
  res.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders)
    res.end()
    return
  }

  if (method === 'POST' && url === '/api/sports-ai') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', async () => {
      try {
        if (!body) {
          throw new Error('Request body is required.')
        }

        const payload = JSON.parse(body)
        const question = payload.question?.toString().trim()

        if (!question) {
          throw new Error('The `question` field is required in the request body.')
        }

        const answer = await getSportsAiAnswer(question)

        if (!answer) {
          throw new Error('No answer was produced by SportsAI.')
        }

        sendJson(res, 200, { answer })
      } catch (error) {
        console.error('SportsAI request failed:', error)
        const message = error?.message || 'Error interno del servidor SportsAI.'
        sendJson(res, 500, { error: message })
      }
    })

    return
  }

  if (method === 'GET' && url === '/') {
    sendJson(res, 200, { status: 'SportsAI API running', version: '1.0.0' })
    return
  }

  sendJson(res, 404, { error: 'Route not found.' })
})

server.listen(PORT, () => {
  console.log(`SportsAI HTTP server listening on http://localhost:${PORT}`)
})
