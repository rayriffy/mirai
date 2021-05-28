export interface Arcade {
  name: string
  arcadeId: string
  // amount of token per one credit
  tokenPerCredit: number
  // discounted price per full credit
  discountedPrice?: number
}
