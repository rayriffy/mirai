import { ReactText } from 'react'

import { useRouter } from 'next/router'

type Language = 'en' | 'th'

type Input = Record<
  Language,
  {
    [key: string]: ReactText
  }
>

export const useLocale = (input: Input) => {
  const { locale: detectedLocale } = useRouter()

  const locale = (key: keyof Input['en']): string => input[window.detectedLocale][key] ?? input['en'][key] ?? key

  return { locale, detectedLocale }
}
