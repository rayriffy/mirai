import { Timestamp } from 'firebase/firestore'

import { Currency } from '../Currency'
import { Role } from '../Role'

export type BalanceKey = `balance_${Currency}`

type UserBalance = {
  [key in BalanceKey]?: number
}
export interface User extends UserBalance {
  displayName: string
  emailHash: string
  preferredStore: string
  role: Role
  favoriteArcades: string[]
  staffStoreId?: string
  staffStoreName?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
