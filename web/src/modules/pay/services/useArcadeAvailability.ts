import { useMemo, useEffect, useState } from 'react'

import dayjs, { Dayjs } from 'dayjs'

import { onValue, ref } from 'firebase/database'
import { getDatabaseInstance } from '../../../core/services/getDatabaseInstance'

export const useArcadeAvailability = (arcadeId: string) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [pingAt, setPingAt] = useState<Dayjs>(null)

  const [secondDiff, setSecondDiff] = useState(-1)
  
  useEffect(() => {
    if (pingAt !== null) {
      setSecondDiff(dayjs().diff(pingAt, 'seconds'))
    }

    const intervalId = setInterval(() => {
      if (pingAt !== null) {
        setSecondDiff(dayjs().diff(pingAt, 'seconds'))
      }
    }, 3000)

    return () => clearInterval(intervalId)
  }, [pingAt])

  useEffect(() => {
    setLoading(true)
    setPingAt(null)

    const listener = onValue(ref(getDatabaseInstance(), `arcades/${arcadeId}`), snapshot => {
      if (snapshot.exists()) {
        setPingAt(dayjs(snapshot.val().pingAt))
      }
      setLoading(false)
    })

    return () => {
      listener()
    }
  }, [arcadeId])

  return {
    loading,
    pingAt,
    secondDiff,
  }
}