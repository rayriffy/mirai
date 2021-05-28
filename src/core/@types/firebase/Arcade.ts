export interface Arcade {
  name: string
  branchId: string
  branchName: string
  // amount of token per one credit
  tokenPerCredit: number
  // discounted price per full credit
  discountedPrice?: number
}
