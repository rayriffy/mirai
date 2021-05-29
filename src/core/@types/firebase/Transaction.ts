import { Timestamp } from 'firebase/firestore'

export interface Transaction {
  arcadeId: string
  arcadeName: string
  branchId: string
  branchName: string
  userId: string
  token: number
  value: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
