import { useEffect, useState, useMemo } from 'react'

import { onSnapshot, collection, doc, getFirestore } from 'firebase/firestore'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

import { User } from '../../core/@types/firebase/User'

export const useUserMetadata = (uid: string) => {
  const [metadata, setMetadata] = useState<User | null>(undefined)

  const isUIDVaid = useMemo(() => typeof uid === 'string' && uid.length > 10, [uid])

  useEffect(() => {
    if (!isUIDVaid) {
      setMetadata(undefined)
    }

    const listener =
    !isUIDVaid
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
  }, [uid, isUIDVaid])

  return metadata
}
