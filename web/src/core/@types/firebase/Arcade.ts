import { Currency } from '../Currency'

export interface Arcade {
  name: string
  storeId: string
  storeName: string
  storeCurrency: Currency
  // amount of token per one credit
  tokenPerCredit: number
}
