import { Fragment, FunctionComponent, useEffect, useState } from 'react'

import axios from 'axios'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'

import { useStoreon } from '../../../../context/storeon'
import { Spinner } from '../../../../core/components/spinner'
import { useLocale } from '../../../../core/services/useLocale'

import { Input } from '../@types/Input'

interface Props {
  input: Input
}

export const Step3: FunctionComponent<Props> = props => {
  const { input } = props

  const {
    user: { auth },
  } = useStoreon('user')
  const { locale } = useLocale({
    en: {
      ready: 'Ready to use',
      successMessage: 'Welcome to Mirai',
      fail: 'Unsuccessful',
      failMessage: 'Please try again after a few minutes',
      start: 'Start',
    },
    th: {
      ready: 'พร้อมใช้งานแล้ว',
      successMessage: 'ยินดีต้อนรับสู่ Mirai',
      fail: 'ไม่สำเร็จ',
      failMessage: 'กรุณาลองอีกครั้งในอีก 2-3 นาที',
      start: 'เริ่มต้นใช้งาน',
    },
  })

  const [result, setResult] = useState<'wait' | 'success' | 'fail'>('wait')

  useEffect(() => {
    ;(async () => {
      try {
        const token = await auth.getIdToken()

        const res = await axios.post('/api/onboarding', input, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        setResult(res.data.success ? 'success' : 'fail')
      } catch (e) {
        setResult('fail')
      }
    })().catch(() => setResult('fail'))
  }, [])

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {result === 'wait' ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <Fragment>
          <div className="flex justify-center">
            {result === 'success' ? (
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            ) : (
              <XCircleIcon className="w-10 h-10 text-red-500" />
            )}
          </div>
          <h1 className="font-bold text-xl text-center text-gray-900 pt-2">
            {result === 'success' ? locale('ready') : locale('fail')}
          </h1>
          <p className="text-gray-700 text-center py-1">
            {result === 'success'
              ? locale('successMessage')
              : locale('failMessage')}
          </p>
          {result === 'success' && (
            <div className="flex justify-center pt-4">
              <Link href="/dashboard">
                <a>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {locale('start')}
                  </button>
                </a>
              </Link>
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}
