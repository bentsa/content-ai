const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

/**
 * Call Claude API for text generation
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
export async function generateText(userPrompt, systemPrompt = '', maxTokens = 1024) {
  if (!ANTHROPIC_KEY) throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Claude API error')
  }

  const data = await res.json()
  return data.content.map(b => b.text || '').join('')
}
