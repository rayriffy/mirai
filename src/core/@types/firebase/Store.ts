import { GeoPoint } from 'firebase/firestore'

export interface Store {
  name: string
  location: GeoPoint
}
