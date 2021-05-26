import { useEffect, useState } from 'react'

import { onSnapshot, collection, doc, getFirestore } from 'firebase/firestore'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

import { User } from '../../core/@types/firebase/User'
import { useStoreon } from '../../context/storeon'

export const useUserMetadata = (uid: string) => {
  const [metadata, setMetadata] = useState<User | null>(undefined)

  useEffect(() => {
    const instance = createFirebaseInstance()

    const listener = onSnapshot(
      doc(collection(getFirestore(instance), 'users'), uid),
      async snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data() as User

          setMetadata(data)
        } else {
          setMetadata(null)
        }
      }
    )

    return () => listener()
  }, [uid])

  return metadata
}
