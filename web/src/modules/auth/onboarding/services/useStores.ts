import { useState, useEffect } from 'react'

import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { createFirebaseInstance } from '../../../../core/services/createFirebaseInstance'

import { Store } from '../../../../core/@types/firebase/Store'
import { StoreWithId } from '../../../../core/@types/StoreWithId'

export const useStores = () => {
  const [data, setData] = useState<StoreWithId[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const instance = createFirebaseInstance()

    onSnapshot(
      query(
        collection(getFirestore(instance), 'stores'),
        where('currency', '==', 'coin')
      ),
      snapshot => {
        const res = snapshot.docs.map(doc => {
          const data = doc.data() as Store
          return {
            id: doc.id,
            data,
          }
        })

        setData(res)
        setLoading(false)
      }
    )
  }, [])

  return {
    loading,
    data,
  }
}
