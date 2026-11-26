import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import express from 'express'
import { errorHandler } from './middleware/error-handler.js'
import apiRouter from './routes/index.js'

const app = express()

app.disable('x-powered-by')
app.use('/api', express.json({ limit: '16kb' }), apiRouter, errorHandler)

function startServer() {
  try {
    if (existsSync('.env')) loadEnvFile('.env')
  } catch {
    console.error('Could not read the server .env file.')
    process.exitCode = 1
    return
  }

  const port = Number(process.env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT must be an integer between 1 and 65535.')
    process.exitCode = 1
    return
  }

  const host = '127.0.0.1'
  app.listen(port, host, (error) => {
    if (error) {
      const detail =
        'code' in error && error.code === 'EADDRINUSE'
          ? 'The port is already in use.'
          : 'Check the port and local network permissions.'
      console.error(`Could not start Express on ${host}:${port}. ${detail}`)
      process.exitCode = 1
      return
    }

    console.log(`Express listening on http://${host}:${port}`)
  })
}

startServer()
