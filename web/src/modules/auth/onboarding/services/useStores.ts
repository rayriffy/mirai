import { useState, useEffect } from 'react'

import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'

import { Store } from '../../../../core/@types/firebase/Store'
import { StoreWithId } from '../../../../core/@types/StoreWithId'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

export const useStores = () => {
  const [data, setData] = useState<StoreWithId[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    onSnapshot(
      query(
        collection(getFirestoreInstance(), 'stores'),
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
