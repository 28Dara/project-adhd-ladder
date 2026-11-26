import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => {
  const config = { plugins: [react()] }
  if (command !== 'serve' || isPreview) return config

  const envFile = new URL('../server/.env', import.meta.url)
  const filePort = existsSync(envFile)
    ? parseEnv(readFileSync(envFile, 'utf8')).PORT
    : undefined
  const port = Number(process.env.PORT ?? filePort ?? 3000)

  return {
    ...config,
    server: {
      proxy: {
        '^/api(?:[/?]|$)': `http://127.0.0.1:${port}`,
      },
    },
  }
})
