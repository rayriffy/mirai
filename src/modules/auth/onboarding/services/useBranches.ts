import { useState, useEffect } from 'react'

import { collection, getFirestore, onSnapshot } from 'firebase/firestore'
import { createFirebaseInstance } from '../../../../core/services/createFirebaseInstance'

import { Branch } from '../../../../core/@types/firebase/Branch'
import { BranchWithId } from '../../../../core/@types/BranchWithId'

export const useBranches = () => {
  const [data, setData] = useState<BranchWithId[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const instance = createFirebaseInstance()

    onSnapshot(collection(getFirestore(instance), 'branches'), snapshot => {
      const res = snapshot.docs.map(doc => {
        const data = doc.data() as Branch
        return {
          id: doc.id,
          data,
        }
      })

      setData(res)
      setLoading(false)
    })
  }, [])

  return {
    loading,
    data,
  }
}
