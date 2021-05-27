import { useCallback, useState } from 'react'

import { NextPage } from 'next'

import { Step } from '../modules/auth/onboarding/components/step'
import { useLocale } from '../core/services/useLocale'
import { Input } from '../modules/auth/onboarding/@types/Input'

import { Step1 } from '../modules/auth/onboarding/components/step1'

const Page: NextPage = () => {
  const { locale } = useLocale({
    en: {
      title: 'Greetings',
      subtitle: 'Please fill all information before using',
    },
    th: {
      title: 'สวัสดี',
      subtitle: 'กรอกข้อมูลเพิ่มเติมก่อนเริ่มใช้งาน',
    },
  })

  // const { data } = useBranches()
  const [step, setStep] = useState<number>(1)
  const onNext = useCallback(() => setStep(o => o + 1), [step])
  const onPrev = useCallback(() => setStep(o => o - 1), [step])

  const [input, setInput] = useState<Input>({
    displayName: '',
    preferredBranch: '',
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          {step === 1 ? <Step1 {...{ input, setInput, onNext }} /> : null}
        </div>
      </div>
    </div>
  )
}

export default Page
