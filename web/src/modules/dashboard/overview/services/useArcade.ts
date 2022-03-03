import { useState, useEffect } from 'react'

import { collection, doc, getDoc } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

import { Arcade } from '../../../../core/@types/firebase/Arcade'

export const useArcade = (arcadeId: string) => {
  const [data, setData] = useState<Arcade>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    getDoc(
      doc(
        collection(getFirestoreInstance(), 'arcades'),
        arcadeId
      )
    )
      .then(doc => {
        if (doc.exists()) {
          setData(doc.data() as Arcade)
          setError(false)
        } else {
          setError(true)
        }
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return {
    data,
    loading,
    error,
  }
}
