export interface Arcade {
  name: string
  storeId: string
  storeName: string
  // amount of token per one credit
  tokenPerCredit: number
  // discounted price per full credit
  discountedPrice?: number
}
