import { Timestamp } from 'firebase/firestore'

export interface Transaction {
  arcadeId: string
  branchId: string
  userId: string
  token: number
  value: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp  
  updatedAt: Timestamp
}
