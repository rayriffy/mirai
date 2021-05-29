import { Role } from '../Role'
export interface User {
  displayName: string
  emailHash: string
  preferredStore: string
  role: Role
  favoriteArcades: string[]
  balance: number
}
