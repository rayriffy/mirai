import { GeoPoint } from 'firebase/firestore'

export interface Store {
  name: string
  currency: 'coin' | 'buck'
  location: GeoPoint
}
