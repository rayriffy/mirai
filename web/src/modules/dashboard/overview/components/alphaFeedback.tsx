import { memo } from 'react'

import Link from 'next/link'

import { SpeakerphoneIcon, HeartIcon } from '@heroicons/react/outline'

import { useLocale } from '../../../../core/services/useLocale'

export const AlphaFeedback = memo(() => {
  const { locale } = useLocale({
    en: {
      title: 'What do you think about this system?',
      desc: 'We would like to hear your feedback. If you like/unlike something, please click the button below to let us know about it',
      button: 'Feedback',
    },
    th: {
      title: 'คุณคิดอย่างไรเกี่ยวกับระบบนี้?',
      desc: 'เราต้องการความคิดเห็นของคุณ หากคุณชอบ/ไม่ชอบส่วนไหนสามารถส่งความเห็นมาได้เลย',
      button: 'ให้ความคิดเห็น',
    },
  })
  return (
    <div className="col-span-2 flex justify-center">
      <div className="p-3 rounded-lg bg-blue-600 sm:p-4 w-full">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-start">
            <span className="flex p-2 rounded-lg bg-blue-800">
              <HeartIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <div className="ml-3">
              <h1 className="font-medium text-white truncate text-lg">
                {locale('title')}
              </h1>
              <p className="text-white text-sm">
                {locale('desc')}
              </p>
              <a
                href="https://airtable.com/shrDT5hUB1AwRJJVn"
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {locale('button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
