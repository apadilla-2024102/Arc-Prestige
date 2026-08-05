const fetch = globalThis.fetch || require('node-fetch')

// Build minimal Gemini payload compatible with the REST endpoint
const buildGeminiPayload = (question) => {
  const SYSTEM_PROMPT = `
Eres "SportsBot", una Inteligencia Artificial especializada EXCLUSIVAMENTE en el mundo del deporte.
Responde con tono cercano, estructurado y concreto. Solo responde sobre deporte.
`.trim()

  return {
    systemInstruction: {
      role: 'system',
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      { role: 'user', parts: [{ text: String(question || '') }] },
    ],
  }
}

const flattenTextItems = (items) => {
  if (!Array.isArray(items)) return []
  return items.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    if (typeof item.text === 'string') {
      const t = item.text.trim()
      return t ? [t] : []
    }
    if (Array.isArray(item.parts)) return flattenTextItems(item.parts)
    if (item.content && Array.isArray(item.content.parts)) return flattenTextItems(item.content.parts)
    if (Array.isArray(item.content)) return flattenTextItems(item.content)
    return []
  })
}

const extractTextFromGeminiResponse = (result) => {
  if (!result || typeof result !== 'object') return null
  const candidateArrays = [
    result.candidates,
    result.output?.candidates,
    result.choices,
    result.outputs?.[0]?.content,
    result.output?.content,
    result.output?.parts,
  ]

  for (const list of candidateArrays) {
    if (!Array.isArray(list) || list.length === 0) continue
    const texts = flattenTextItems(list)
    if (texts.length) return texts.join(' ')
  }

  if (typeof result.output === 'string' && result.output.trim()) return result.output.trim()
  if (typeof result.text === 'string' && result.text.trim()) return result.text.trim()
  return null
}

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 204, body: '' }
    }

    const body = event.body ? JSON.parse(event.body) : {}
    const question = String(body.question || '').trim()
    if (!question) return { statusCode: 400, body: JSON.stringify({ error: 'question is required' }) }

    const API_KEY = process.env.GEMINI_API_KEY || ''
    if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not set in environment' }) }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'
    const payload = buildGeminiPayload(question)

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return { statusCode: 502, body: JSON.stringify({ error: `Gemini error ${resp.status}`, detail: text }) }
    }

    const json = await resp.json()
    const answer = extractTextFromGeminiResponse(json)
    if (answer) return { statusCode: 200, body: JSON.stringify({ answer }) }

    return { statusCode: 200, body: JSON.stringify({ answer: null }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) }
  }
}
