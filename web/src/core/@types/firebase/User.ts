import { Timestamp } from 'firebase/firestore'

import { Role } from '../Role'
export interface User {
  displayName: string
  emailHash: string
  preferredStore: string
  role: Role
  favoriteArcades: string[]
  balance_coin: number
  balance_buck?: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
