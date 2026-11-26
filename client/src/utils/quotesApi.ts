import type { Quote } from '../types/quote'

export async function fetchRandomQuote(
  signal: AbortSignal,
): Promise<Quote | null> {
  const response = await fetch('https://dummyjson.com/quotes/random', {
    signal,
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'no-referrer',
  })

  if (!response.ok) throw new Error('Quote request failed.')

  const data: unknown = await response.json().catch((error: unknown) => {
    if (error instanceof SyntaxError) return null
    throw error
  })
  if (
    !data ||
    typeof data !== 'object' ||
    !('id' in data) ||
    typeof data.id !== 'number' ||
    !Number.isSafeInteger(data.id) ||
    !('quote' in data) ||
    typeof data.quote !== 'string' ||
    !data.quote.trim() ||
    !('author' in data) ||
    typeof data.author !== 'string' ||
    !data.author.trim()
  ) {
    return null
  }

  return { id: data.id, text: data.quote, author: data.author }
}
