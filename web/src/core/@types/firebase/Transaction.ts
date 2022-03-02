import { Timestamp } from '@google-cloud/firestore'

export type Transaction = (
  | {
      type: 'topup'
      createdBy: string
      userId: string
      storeId: string
      storeName: string
    }
  | {
      type: 'repossessed'
      actionBy: string
      userId: string
      storeId: string
      storeName: string
      reason: 'common1' | 'common2' | string
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
  currency: 'coin' | 'buck'
  status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}
