import { useMemo, useEffect, useState, memo, Fragment } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/th'

import { useLocale } from '../../../../../core/services/useLocale'

dayjs.extend(relativeTime)

interface Props {
  datetime: Date
}

export const RelativeTime = memo<Props>(props => {
  const { datetime } = props

  const { detectedLocale } = useLocale({
    en: {},
    th: {},
  })

  const [timestamp, setTimestamp] = useState(new Date().getTime())

  const relativeTime = useMemo(
    () => dayjs(datetime).locale(detectedLocale).fromNow(),
    [timestamp]
  )

  useEffect(() => {
    const listener = setInterval(() => {
      setTimestamp(new Date().getTime())
    }, 2000)

    return () => clearInterval(listener)
  }, [])

  return <Fragment>{relativeTime}</Fragment>
})
