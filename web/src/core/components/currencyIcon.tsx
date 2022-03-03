import { memo, SVGProps, useMemo } from 'react'
import { Currency } from '../@types/Currency'
import { currencies } from '../constants/currencies'

interface Props extends SVGProps<SVGSVGElement> {
  currency: Currency
}

export const CurrencyIcon = memo<Props>(props => {
  const { currency, ...rest } = props

  const TargetIcon = useMemo(
    () => currencies.find(o => o.id === currency).icon,
    [currency]
  )

  return <TargetIcon {...rest} />
})
