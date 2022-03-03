import { memo, useEffect, useMemo, useState } from 'react'

import dayjs, { Dayjs, locale } from 'dayjs'
import { SpeakerphoneIcon } from '@heroicons/react/outline'
import { useLocale } from '../../../../core/services/useLocale'

interface Props {
  endTestDate: Dayjs
}

export const Alpha = memo<Props>(props => {
  const { endTestDate } = props

  const [flip, setFlip] = useState(false)
  const remainingTime = useMemo(() => {
    const now = dayjs()
    let second = endTestDate.diff(now, 'seconds')

    let minute = Math.floor(second / 60)
    second = second - minute * 60

    let hour = Math.floor(minute / 60)
    minute = minute - hour * 60

    let day = Math.floor(hour / 24)
    hour = hour - day * 24

    return {
      day,
      hour,
      minute,
      second,
    }
  }, [flip])
  useEffect(() => {
    setInterval(() => setFlip(o => !o), 1000)
  }, [])

  const { locale } = useLocale({
    en: {
      title: 'Alpha test ongoing',
      desc: 'The system will only be available for testing only from 1 - 31 March. After the alpha test, you will unable to topup token into your wallet until system open again.',
      d: 'Days',
      h: 'Hours',
      m: 'Minutes',
      s: 'Seconds',
    },
    th: {
      title: 'ระบบอยู่ในระหว่างการทดสอบ',
      desc: 'ระบบจะใช้งานได้เพียงในระยะเวลา 1-31 มีนาคมเท่านั้น หลังจากทดสอบระบบเสร็จแล้วจะไม่สามารถเติมเหรียญได้อีกจนกว่าจะเปิดระบบอีกรอบ',
      d: 'วัน',
      h: 'ชั่วโมง',
      m: 'นาที',
      s: 'วินาที',
    },
  })

  return (
    <div className="max-w-lg mx-auto flex justify-center">
      <div className="p-3 rounded-lg bg-orange-600 sm:p-4 mb-4 w-full">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-start">
            <span className="flex p-2 rounded-lg bg-orange-800">
              <SpeakerphoneIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <div className="ml-3">
              <h1 className="font-medium text-white truncate text-lg">
                {locale('title')}
              </h1>
              <p className="text-white text-sm">{locale('desc')}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex space-x-4 text-white justify-center mt-3">
            <div>
              <div className="bg-orange-800 px-4 py-3 rounded-lg text-center font-mono">
                {remainingTime.day.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-center mt-0.5">{locale('d')}</div>
            </div>
            <div>
              <div className="bg-orange-800 px-4 py-3 rounded-lg text-center font-mono">
                {remainingTime.hour.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-center mt-0.5">{locale('h')}</div>
            </div>
            <div>
              <div className="bg-orange-800 px-4 py-3 rounded-lg text-center font-mono">
                {remainingTime.minute.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-center mt-0.5">{locale('m')}</div>
            </div>
            <div>
              <div className="bg-orange-800 px-4 py-3 rounded-lg text-center font-mono">
                {remainingTime.second.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-center mt-0.5">{locale('s')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
