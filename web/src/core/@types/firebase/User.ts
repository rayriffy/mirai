import { Timestamp } from 'firebase/firestore'

import { Role } from '../Role'
export interface User {
  displayName: string
  emailHash: string
  preferredStore: string
  role: Role
  favoriteArcades: string[]
  balance: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
