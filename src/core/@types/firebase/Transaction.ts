import { Timestamp } from 'firebase/firestore'

export interface Transaction {
  type: 'payment' | 'topup'
  arcadeId: string
  arcadeName: string
  storeId: string
  storeName: string
  userId: string
  token: number
  value: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
