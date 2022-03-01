import { ReactText } from 'react'

import { useRouter } from 'next/router'

type Language = 'en' | 'th'

// type Input = Partial<
//   Record<
//     Language,
//     {
//       [key: string]: ReactText
//     }
//   >
// >

type Input = Record<
  Language,
  {
    [key: string]: string
  }
>

export const useLocale = (input: Input) => {
  const { locale: detectedLocale } = useRouter()

  const locale = (key: keyof Input['en']): string => {
    if (input[window.detectedLocale] === undefined) {
      return input['en'][key] ?? `#${key}#`
    }

    return input[window.detectedLocale][key] ?? input['en'][key] ?? `#${key}#`
  }

  return { locale, detectedLocale }
}
