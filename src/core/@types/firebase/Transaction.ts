import { Timestamp } from '@google-cloud/firestore'

export type Transaction = ({
  type: 'topup'
  createdBy: string
  userId: string
} | {
  type: 'payment'
  arcadeId: string
  arcadeName: string
  storeId: string
  storeName: string
  token: number
  userId: string
} | {
  type: 'manual_coin'
  arcadeId: string
}) & {
  value: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
