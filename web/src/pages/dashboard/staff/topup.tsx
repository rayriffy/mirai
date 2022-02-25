import { Fragment, useState, useEffect } from 'react'

import { NextPage } from 'next'

import { useLocale } from '../../../core/services/useLocale'

import { Step } from '../../../core/components/step'
import { Step1 } from '../../../modules/topup/components/step1'
import { Step2 } from '../../../modules/topup/components/step2'

import { UserWithId } from '../../../core/@types/UserWIthId'
import { CheckCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'

const Page: NextPage = () => {
  const [targetUser, setTargetUser] = useState<UserWithId | null>(null)

  const [step, setStep] = useState<number>(1)

  const onNext = () => setStep(o => o + 1)
  const onPrev = () => setStep(o => o - 1)

  const { locale } = useLocale({
    en: {
      back: 'Back to dashboard',
      success: 'Success',
      failed: 'Failed',
    },
    th: {
      back: 'กลับไปหน้าหลัก',
      success: 'สำเร็จ',
      failed: 'ไม่สำเร็จ',
    },
  })

  return (
    <Fragment>
      <div className="py-6">
        <Step current={step} total={3} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            <Step1 {...{ onNext, setTargetUser }} />
          ) : step === 2 ? (
            <Step2 {...{ targetUser, onNext, onPrev }} />
          ) : (
            <div className="border border-gray-200 bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add balance
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Put amout of balance to add
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-center mt-4">
                  <CheckCircleIcon className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="font-bold text-xl text-center text-gray-900 pt-2">
                  {locale('success')}
                  {/* {locale(result === 'success' ? 'success' : 'failed')} */}
                </h1>
                <p className="text-gray-700 text-center py-1 mb-2">
                  Token has been added to user account
                </p>

                <div className=" mt-2">
                  <Link href="/dashboard">
                    <a className="bg-white hover:bg-gray-50 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                      {locale('back')}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default Page
