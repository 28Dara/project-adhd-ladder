import { useCallback, useEffect, useRef, useState } from 'react'
import { getLocalDateKey } from '../utils/dates'

export function useLocalDateKey() {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey(new Date()))
  const timer = useRef<number | undefined>(undefined)

  const syncDate = useCallback(function syncDate(now = new Date()) {
    const currentDate = getLocalDateKey(now)
    setDateKey(currentDate)
    window.clearTimeout(timer.current)
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    timer.current = window.setTimeout(
      syncDate,
      midnight.getTime() - now.getTime(),
    )
    return currentDate
  }, [])

  useEffect(() => {
    function refreshDate() {
      syncDate()
    }

    refreshDate()
    window.addEventListener('focus', refreshDate)
    document.addEventListener('visibilitychange', refreshDate)
    return () => {
      window.clearTimeout(timer.current)
      window.removeEventListener('focus', refreshDate)
      document.removeEventListener('visibilitychange', refreshDate)
    }
  }, [syncDate])

  return { dateKey, syncDate }
}
