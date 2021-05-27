import { GeoPoint } from 'firebase/firestore'

export interface Branch {
  name: string
  location: GeoPoint
}
