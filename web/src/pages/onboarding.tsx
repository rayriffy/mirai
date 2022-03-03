import { Fragment, useCallback, useEffect, useState } from 'react'

import { NextPage } from 'next'

import { Step } from '../core/components/step'
import { useLocale } from '../core/services/useLocale'

import { Step1 } from '../modules/auth/onboarding/components/step1'
import { Step2 } from '../modules/auth/onboarding/components/step2'
import { Step3 } from '../modules/auth/onboarding/components/step3'

import { Input } from '../modules/auth/onboarding/@types/Input'
import { useStoreon } from '../context/storeon'
import { useRouter } from 'next/router'
import { useNetworkAvailability } from 'web-api-hooks'
import { StatusOfflineIcon } from '@heroicons/react/outline'

const Page: NextPage = () => {
  const { locale } = useLocale({
    en: {
      title: 'Greetings',
      subtitle: 'Please fill all information before using',
      offline_title: 'No internet connection',
      offline_desc: 'Please connect to the internet and restart the app',
    },
    th: {
      title: 'สวัสดี',
      subtitle: 'กรอกข้อมูลเพิ่มเติมก่อนเริ่มใช้งาน',
      offline_title: 'ไม่มีอินเทอร์เน็ต',
      offline_desc: 'กรุณาเชื่อมต่ออินเตอร์เน็ตแล้วลองอีกครั้ง',
    },
  })

  const [step, setStep] = useState<number>(1)
  const onNext = useCallback(() => setStep(o => o + 1), [])
  const onPrev = useCallback(() => setStep(o => o - 1), [])

  const [input, setInput] = useState<Input>({
    displayName: '',
    preferredStore: '',
  })
  const isOnline = useNetworkAvailability()

  const router = useRouter()
  const { user } = useStoreon('user')
  useEffect(() => {
    if (typeof user?.metadata?.displayName === 'string') {
      router.push('/dashboard')
    }
  }, [user?.metadata?.displayName])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {!isOnline ? (
        <div className="mx-auto text-gray-500 text-center">
          <StatusOfflineIcon className="w-12 h-12 mx-auto" />
          <h1 className="text-lg font-semibold">{locale('offline_title')}</h1>
          <p>{locale('offline_desc')}</p>
        </div>
      ) : (
        <Fragment>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl md:text-4xl font-extrabold text-gray-900">
              {locale('title')}!
            </h2>
            <p className="text-center text-sm text-gray-600 max-w">
              {locale('subtitle')}
            </p>
          </div>
          <div className="py-4">
            <Step current={step} total={3} />
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white shadow sm:rounded-lg">
              {step === 1 ? (
                <Step1 {...{ input, setInput, onNext }} />
              ) : step === 2 ? (
                <Step2 {...{ input, setInput, onPrev, onNext }} />
              ) : (
                <Step3 {...{ input }} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Page
