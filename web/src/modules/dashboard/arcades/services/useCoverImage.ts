import { useState, useMemo, useEffect } from 'react'

import { ref, getDownloadURL } from 'firebase/storage'

import { getStorageInstance } from '../../../../core/services/getStorageInstance'

export const useCoverImage = (arcadeId: string) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string>(null)

  useEffect(() => {
    setLoading(true)
    setData(null)

    getDownloadURL(ref(getStorageInstance(), `${arcadeId}.jpg`))
      .then(url => {
        console.log(data)
        setData(url)
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [arcadeId])

  return {
    loading,
    data,
  }
}
