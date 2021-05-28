import { Role } from '../Role'
export interface User {
  displayName: string
  emailHash: string
  preferredBranch: string
  role: Role
  favoriteArcades: string[]
  balance: number
}
