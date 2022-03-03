import { GeoPoint } from 'firebase/firestore'

import { Currency } from '../Currency'

export interface Store {
  name: string
  currency: Currency
  location: GeoPoint
}
