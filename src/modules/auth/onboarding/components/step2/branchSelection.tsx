import React, { forwardRef, Fragment } from 'react'

import { useBranches } from '../../services/useBranches'

import { BranchSelector } from './branchSelector'
import { BranchSelectorSkeleton } from './branchSelectorSkeleton'

export const BranchSelection = forwardRef<HTMLInputElement>((_, ref) => {
  const { data, loading } = useBranches()

  console.log({ data, loading })

  return (
    <Fragment>
      {loading ? (
        <BranchSelectorSkeleton />
      ) : (
        <BranchSelector ref={ref} branches={data} />
      )}
    </Fragment>
  )

})
