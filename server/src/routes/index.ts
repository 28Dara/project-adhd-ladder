import { Router } from 'express'
import { HttpError } from '../utils/errors.js'

const apiRouter = Router()

apiRouter.get('/healthz', (_request, response) => {
  response.json({ status: 'ok' })
})

apiRouter.use((_request, _response, next) => {
  next(new HttpError(404, 'API route not found.'))
})

export default apiRouter
