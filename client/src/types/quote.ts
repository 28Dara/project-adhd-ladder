export interface Quote {
  id: number
  text: string
  author: string
}

export type DailyQuoteState =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; quote: Quote }
  | { status: 'error'; message: string }
