import { FunctionComponent, SVGProps } from 'react'
import { FaCoins, FaProductHunt } from 'react-icons/fa'

import { Currency } from '../@types/Currency'

interface CurrencyObject {
  id: Currency
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
}

export const currencies: CurrencyObject[] = [
  {
    id: 'coin',
    icon: FaCoins,
  },
  {
    id: 'buck',
    icon: FaProductHunt,
  },
]
