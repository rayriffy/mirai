import { useEffect, useState } from "react"

import { toString } from 'qrcode'

export const useQR = (input: string) => {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    toString(input, {
      margin: 0,
    }, (e, res) => {
      if (e) {
        setError(true)
      } else {
        setData(res)
        setError(false)
      }
    })
  }, [input])

  return {
    data,
    error,
  }
}