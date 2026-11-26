import { useId, type ReactNode } from 'react'
import './RoutePanel.css'

export default function RoutePanel({
  title,
  busy = false,
  children,
}: {
  title: string
  busy?: boolean
  children?: ReactNode
}) {
  const titleId = useId()

  return (
    <main className="route-panel">
      <section className="route-panel__card" aria-labelledby={titleId}>
        <h1 id={titleId} role={busy ? 'status' : undefined}>
          {title}
        </h1>
        {children}
      </section>
    </main>
  )
}
