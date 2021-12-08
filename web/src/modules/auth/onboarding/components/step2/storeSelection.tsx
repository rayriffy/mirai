import { forwardRef, Fragment } from 'react'

import { useStores } from '../../services/useStores'

import { StoreSelector } from './storeSelector'
import { StoreSelectorSkeleton } from './storeSelectorSkeleton'

export const StoreSelection = forwardRef<HTMLInputElement>((_, ref) => {
  const { data, loading } = useStores()

  console.log({ data, loading })

  return (
    <Fragment>
      {loading ? (
        <StoreSelectorSkeleton />
      ) : (
        <StoreSelector ref={ref} stores={data} />
      )}
    </Fragment>
  )
})
