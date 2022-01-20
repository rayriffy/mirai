import { useEffect, useState } from 'react'

import { onSnapshot, collection, doc, getFirestore } from 'firebase/firestore'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

import { User } from '../../core/@types/firebase/User'

export const useUserMetadata = (uid: string) => {
  const [metadata, setMetadata] = useState<User | null>(undefined)

  useEffect(() => {
    if (uid === '') {
      setMetadata(undefined)
    }

    const listener =
      uid === ''
        ? () => {}
        : onSnapshot(
            doc(
              collection(getFirestore(createFirebaseInstance()), 'users'),
              uid
            ),
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
