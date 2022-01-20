import { useEffect, useState, useMemo } from 'react'

import { onSnapshot, collection, doc, getFirestore } from 'firebase/firestore'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

import { User } from '../../core/@types/firebase/User'

export const useUserMetadata = (uid: string) => {
  const [metadata, setMetadata] = useState<User | null>(undefined)

  const isUIDVaid = useMemo(() => typeof uid === 'string' && uid.length > 10, [uid])

  useEffect(() => {
    setMetadata(undefined)

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
            snapshot => {
              try {
                const data = snapshot.data() as User

                if (data === undefined) {
                  setMetadata(null)
                } else {
                  setMetadata(data)
                }
              } catch {
                throw new Error('cannot process user metadata')
              }
            }
          )

    return () => listener()
  }, [uid, isUIDVaid])

  return metadata
}
