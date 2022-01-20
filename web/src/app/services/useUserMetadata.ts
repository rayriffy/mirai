import { useEffect, useState, useMemo } from 'react'

import { useRouter } from 'next/router'
import { useStoreon } from '../../context/storeon'

import { onSnapshot, collection, doc, getFirestore } from 'firebase/firestore'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'

import { User } from '../../core/@types/firebase/User'

export const useUserMetadata = (uid: string) => {
  const [metadata, setMetadata] = useState<User | null>(undefined)

  const router = useRouter()
  const { dispatch } = useStoreon('user')

  const isUIDVaid = useMemo(
    () => typeof uid === 'string' && uid.length > 10,
    [uid]
  )

  useEffect(() => {
    setMetadata(undefined)

    if (!isUIDVaid) {
      setMetadata(undefined)
    }

    const listener = !isUIDVaid
      ? () => {}
      : onSnapshot(
          doc(collection(getFirestore(createFirebaseInstance()), 'users'), uid),
          snapshot => {
            try {
              const data = snapshot.data() as User

              if (data === undefined) {
                setMetadata(null)
                router.push('/onboarding')
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

  useEffect(() => {
    dispatch('user/metadata', metadata)
  }, [metadata])

  return metadata
}
