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

  const arcadeAvailability = useMemo(() => {
    const acceptableDelay = 1.5 * 60 // 1.5 minutes
    const offlineDelay = 3 * 60 // 3 minutes

    if (loading) {
      return 'loading'
    } else if (secondDiff === -1) {
      return 'unknown'
    } else if (secondDiff <= acceptableDelay) {
      return 'online'
    } else if (secondDiff >= offlineDelay) {
      return 'offline'
    } else {
      return 'delayed'
    }
  }, [loading, secondDiff])

  return {
    loading,
    pingAt,
    secondDiff,
    availability: arcadeAvailability,
  }
}