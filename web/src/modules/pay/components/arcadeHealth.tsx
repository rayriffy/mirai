import { Fragment, memo, useMemo } from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/th'

import { useArcadeAvailability } from '../services/useArcadeAvailability'
import { useLocale } from '../../../core/services/useLocale'
import { classNames } from '../../../core/services/classNames'

interface Props {
  arcadeId: string
}

dayjs.extend(relativeTime)

export const ArcadeHealth = memo<Props>(props => {
  const { arcadeId } = props

  const { loading, secondDiff } = useArcadeAvailability(arcadeId)

  const { locale, detectedLocale } = useLocale({
    en: {
      loading: 'Checking',
      unknown: 'Unknown',
      online: 'Online',
      offline: 'Offline',
      delayed: 'Delayed',
    },
    th: {
      loading: 'กำลังตรวจสอบ',
      unknown: 'ไม่ทราบสถานะ',
      online: 'ออนไลน์',
      offline: 'ออฟไลน์',
      delayed: 'ตอบสนองช้า',
    },
  })

  const builtResult = useMemo(() => {
    const acceptableDelay = 1.5 * 60 // 1.5 minutes
    const offlineDelay = 3 * 60 // 3 minutes

    if (secondDiff === -1) {
      return {
        primary: 'bg-gray-500',
        secondary: 'bg-gray-400',
        text: 'text-gray-600',
        content: locale('unknown'),
      }
    } else if (secondDiff <= acceptableDelay) {
      return {
        primary: 'bg-green-500',
        secondary: 'bg-green-400',
        text: 'text-green-600',
        content: locale('online'),
      }
    } else if (secondDiff >= offlineDelay) {
      return {
        primary: 'bg-red-500',
        secondary: 'bg-red-400',
        text: 'text-red-600',
        content: locale('offline'),
      }
    } else {
      return {
        primary: 'bg-yellow-500',
        secondary: 'bg-yellow-400',
        text: 'text-yellow-600',
        content: locale('delayed'),
      }
    }
  }, [secondDiff, detectedLocale])

  return (
    <div className="border rounded flex px-2 py-1.5 items-center">
      <span className="flex h-2 w-2 relative mr-2">
        <span className={classNames(loading ? 'bg-gray-400' : `${builtResult.secondary} animate-ping`, "absolute inline-flex h-full w-full rounded-full opacity-75")}></span>
        <span className={classNames(loading ? 'bg-gray-500' : builtResult.primary, "relative inline-flex rounded-full h-2 w-2")}></span>
      </span>
      <span className={classNames(loading ? 'text-gray-500' : builtResult.text, 'leading-none tracking-wide font-medium text-xs')}>{loading ? locale('loading') : builtResult.content}</span>
    </div>
  )
})
