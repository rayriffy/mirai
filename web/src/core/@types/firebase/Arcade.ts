export interface Arcade {
  name: string
  storeId: string
  storeName: string
  storeCurrency: 'coin' | 'buck'
  // amount of token per one credit
  tokenPerCredit: number
}
