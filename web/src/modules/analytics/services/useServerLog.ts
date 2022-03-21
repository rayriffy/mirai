import { useEffect, useMemo, useState } from 'react'

import dayjs from 'dayjs'
import sortBy from 'lodash/sortBy'

import { ref, onValue, query, limitToLast } from 'firebase/database'
import { getDatabaseInstance } from '../../../core/services/getDatabaseInstance'

interface Log {
  unit: string
  message: string
  createdAt: string
}

export const useServerLog = (storeId: string) => {
  const targetDate = useMemo(() => dayjs().format('YYYYMMDD'), [])

  const [loading, setLoading] = useState(true)

  const [rawLogs, setRawLogs] = useState<Log[]>([])
  const sortedLogs = useMemo(() => sortBy(rawLogs, ['createdAt']).reverse().slice(0, 50), [rawLogs])

  useEffect(() => {
    setLoading(true)
    setRawLogs([])

    const listener = onValue(query(ref(getDatabaseInstance(), `stores/${storeId}/${targetDate}`), limitToLast(50)), snapshot => {
      setLoading(false)
      snapshot.forEach(child => {
        setRawLogs(prev => [...prev, child.val()])
      })
    })

    return () => listener()
  }, [storeId])

  return {
    loading,
    data: sortedLogs
  }
}