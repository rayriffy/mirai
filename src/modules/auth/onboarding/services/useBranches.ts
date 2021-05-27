import { collection, getFirestore, onSnapshot } from '@firebase/firestore'
import { useState, useEffect } from 'react'

import { Branch } from '../../../../core/@types/firebase/Branch'
import { createFirebaseInstance } from '../../../../core/services/createFirebaseInstance'

interface BranchWithId {
  id: string
  data: Branch
}

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

      setLoading(false)
      setData(res)
    })
  }, [])

  return {
    loading,
    data,
  }
}
