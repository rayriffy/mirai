import { Transaction } from '../../../core/@types/firebase/Transaction'

export interface TopupAnalytic {
  id: string
  date: Date
  amount: number
  type: Transaction['type']
  status: Transaction['status']
}
