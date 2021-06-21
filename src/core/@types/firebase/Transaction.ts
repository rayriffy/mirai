import { Timestamp } from '@google-cloud/firestore'

export type Transaction = ({
  type: 'topup'
  createdBy: string
} | {
  type: 'payment'
  arcadeId: string
  arcadeName: string
  storeId: string
  storeName: string
  token: number
}) & {
  userId: string
  value: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
