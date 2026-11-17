// Vercel serverless function: reuses the Sports AI handler shared with Netlify.
const { handler } = require('../netlify/functions/sports-ai')

module.exports = async (req, res) => {
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
  const result = await handler({ httpMethod: req.method, body })

  res.statusCode = result.statusCode
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(result.body)
}
