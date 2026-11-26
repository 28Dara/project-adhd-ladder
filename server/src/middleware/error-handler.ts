import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../utils/errors.js'

function getClientError(error: unknown): HttpError | undefined {
  if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
    return error
  }

  if (!(error instanceof Error) || !('type' in error)) return

  switch (error.type) {
    case 'entity.parse.failed':
      return new HttpError(400, 'Invalid JSON body.')
    case 'request.aborted':
    case 'request.size.invalid':
      return new HttpError(400, 'Invalid request body.')
    case 'entity.too.large':
      return new HttpError(413, 'JSON body is too large.')
    case 'charset.unsupported':
    case 'encoding.unsupported':
      return new HttpError(415, 'Unsupported JSON charset or encoding.')
  }
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(new Error('Response already started.'))
    return
  }

  const clientError = getClientError(error)
  if (clientError) {
    response.status(clientError.status).json({ message: clientError.message })
    return
  }

  console.error('Unexpected API error.')
  response.status(500).json({ message: 'Internal server error.' })
}
