export interface User {
  displayName: string
  email: string
  preferredBrnach?: string
  role: 'default' | 'staff' | 'admin'
}
