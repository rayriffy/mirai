import { FunctionComponent, useMemo, useCallback, useState } from 'react'

import { HeartIcon as HeartOutline } from '@heroicons/react/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/solid'
import { useStoreon } from '../../../context/storeon'
import { createApiInstance } from '../../../core/services/createApiInstance'

interface Props {
  arcadeId: string
  paymentProcessing: boolean
}

export const FavoriteButton: FunctionComponent<Props> = props => {
  const { arcadeId, paymentProcessing } = props

  const [disabled, setDisabled] = useState(false)
  const {
    user: {
      auth,
      metadata: { favoriteArcades },
    },
  } = useStoreon('user')

  const isFavorite = useMemo(
    () => favoriteArcades.includes(arcadeId),
    [arcadeId, favoriteArcades]
  )

  const onFavoriteToggle = useCallback(async () => {
    setDisabled(true)
    const apiInstance = await createApiInstance(auth)
    await apiInstance
      .post('/api/toggleFavorite', {
        targetArcade: arcadeId,
      })
      .catch(e => console.error(e))
    setDisabled(false)
  }, [arcadeId, auth.uid])

  return (
    <button
      type="button"
      disabled={paymentProcessing || disabled}
      onClick={onFavoriteToggle}
      className="transition inline-flex items-center justify-center p-2 rounded-md border border-gray-300 shadow-sm text-base font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:hover:bg-gray-100 disabled:cursor-wait"
    >
      {isFavorite ? (
        <HeartSolid className="w-5 h-5 text-pink-500" />
      ) : (
        <HeartOutline className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}
