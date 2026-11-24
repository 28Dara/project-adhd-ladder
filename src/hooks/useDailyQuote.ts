import { useLayoutEffect, useRef, useState } from 'react'
import type { DailyQuoteState, Quote } from '../types/quote'
import { getPreviousLocalDateKey } from '../utils/dates'
import { fetchRandomQuote } from '../utils/quotesApi'

const HISTORY_DAYS = 6
const MAX_REQUESTS = 5

type RevealedQuote = { date: string; quote: Quote }
type QuoteAttempt = { date: string; state: DailyQuoteState }

function getRecentQuotes(history: readonly RevealedQuote[], date: string) {
  const earliest = getPreviousLocalDateKey(date, HISTORY_DAYS)
  return history.filter((entry) => entry.date >= earliest && entry.date <= date)
}

function normalizeQuoteText(text: string) {
  return text.trim().replace(/\s+/gu, ' ').toLowerCase()
}

export function useDailyQuote(today: string, syncDate: () => string) {
  const [history, setHistory] = useState<readonly RevealedQuote[]>([])
  const [attempt, setAttempt] = useState<QuoteAttempt>()
  const activeRequest = useRef<{ date: string; controller: AbortController }>(
    undefined,
  )
  const recentQuotes = getRecentQuotes(history, today)

  if (recentQuotes.length !== history.length) setHistory(recentQuotes)
  if (attempt && attempt.date !== today) setAttempt(undefined)

  useLayoutEffect(() => {
    const request = activeRequest.current
    if (request && request.date !== today) {
      activeRequest.current = undefined
      request.controller.abort()
    }
  }, [today])

  useLayoutEffect(
    () => () => {
      activeRequest.current?.controller.abort()
    },
    [],
  )

  async function revealQuote() {
    const date = syncDate()
    const recent = getRecentQuotes(history, date)
    if (
      recent.some((entry) => entry.date === date) ||
      activeRequest.current?.date === date
    ) {
      return
    }

    activeRequest.current?.controller.abort()
    const request = { date, controller: new AbortController() }
    activeRequest.current = request
    const { signal } = request.controller
    const isCurrent = () => !signal.aborted && syncDate() === date
    let revealed = false

    setAttempt({ date, state: { status: 'loading' } })

    try {
      const recentIds = new Set(recent.map(({ quote }) => quote.id))
      const recentTexts = new Set(
        recent.map(({ quote }) => normalizeQuoteText(quote.text)),
      )

      for (let index = 0; index < MAX_REQUESTS; index += 1) {
        const quote = await fetchRandomQuote(signal)
        if (!isCurrent()) return

        if (!quote) {
          setAttempt({
            date,
            state: {
              status: 'error',
              message: 'No usable quote was received. Try again.',
            },
          })
          return
        }

        if (
          recentIds.has(quote.id) ||
          recentTexts.has(normalizeQuoteText(quote.text))
        ) {
          continue
        }

        revealed = true
        setHistory((previous) => [
          ...getRecentQuotes(previous, date),
          { date, quote },
        ])
        setAttempt(undefined)
        return
      }

      setAttempt({
        date,
        state: {
          status: 'error',
          message: 'We could not find a different quote. Try again.',
        },
      })
    } catch {
      if (isCurrent()) {
        setAttempt({
          date,
          state: {
            status: 'error',
            message: 'We could not load a quote. Try again.',
          },
        })
      }
    } finally {
      // Keep a successful attempt locked until its day changes.
      if (!revealed && activeRequest.current === request)
        activeRequest.current = undefined
    }
  }

  const quote = recentQuotes.find((entry) => entry.date === today)?.quote
  const quoteState: DailyQuoteState = quote
    ? { status: 'success', quote }
    : attempt?.date === today
      ? attempt.state
      : { status: 'idle' }

  return { quoteState, revealQuote }
}
