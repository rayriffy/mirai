import { ReactText } from "react"

import { useRouter } from 'next/router'

type Language = 'en' | 'th'

type Input = Record<Language, {
  [key: string]: ReactText
}>

export const useLocale = (input: Input) => {
  const { locale: targetLocale } = useRouter()

  const locale = (key: keyof Input['en']) => input[targetLocale][key] ?? key

  return { locale }
}