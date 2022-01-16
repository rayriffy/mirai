import { Timestamp } from '@google-cloud/firestore'

export type Transaction = (
  | {
      type: 'topup'
      createdBy: string
      userId: string
    }
  | {
      type: 'payment'
      arcadeId: string
      arcadeName: string
      storeId: string
      storeName: string
      userId: string
    }
  | {
      type: 'manual_coin'
      arcadeId: string
    }
) & {
  token: number
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
