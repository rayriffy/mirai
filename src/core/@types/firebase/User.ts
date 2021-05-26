export interface User {
  displayName: string
  emailHash: string
  preferredBranch?: string
  role: 'default' | 'staff' | 'admin'
}
