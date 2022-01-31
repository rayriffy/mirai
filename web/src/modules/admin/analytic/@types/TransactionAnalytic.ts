import { Transaction } from '../../../../core/@types/firebase/Transaction'

export interface TransactionAnalytic {
  id: string
  date: Date
  amount: number
  arcadeId: string
  arcadeName: string
  type: Transaction['type']
  status: Transaction['status']
}
