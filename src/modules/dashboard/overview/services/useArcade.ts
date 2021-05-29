import { useState, useEffect } from 'react'

import { collection, doc, getFirestore, getDoc } from '@firebase/firestore'
import { createFirebaseInstance } from '../../../../core/services/createFirebaseInstance'
import { Arcade } from '../../../../core/@types/firebase/Arcade'

export const useArcade = (arcadeId: string) => {
  const [data, setData] = useState<Arcade>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    getDoc(
      doc(
        collection(getFirestore(createFirebaseInstance()), 'arcades'),
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
