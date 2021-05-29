import { Transaction } from './firebase/Transaction'

export interface TransactionWithId {
  id: string
  data: Transaction
}
