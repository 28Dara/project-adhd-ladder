import { useEffect, useState } from 'react'
import { getLocalDateKey } from '../utils/dates'

export function useLocalDateKey() {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey(new Date()))

  useEffect(() => {
    let timer: number

    function syncDate() {
      window.clearTimeout(timer)
      const now = new Date()
      setDateKey(getLocalDateKey(now))
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      timer = window.setTimeout(syncDate, midnight.getTime() - now.getTime())
    }

    syncDate()
    document.addEventListener('visibilitychange', syncDate)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', syncDate)
    }
  }, [])

  return dateKey
}
