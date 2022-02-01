import { Fragment, useState, useEffect } from 'react'

import { NextPage } from 'next'

import { Step } from '../../../core/components/step'
import { Step1 } from '../../../modules/topup/components/step1'
import { Step2 } from '../../../modules/topup/components/step2'

import { UserWithId } from '../../../core/@types/UserWIthId'

const Page: NextPage = () => {
  const [targetUser, setTargetUser] = useState<UserWithId | null>(null)

  const [step, setStep] = useState<number>(1)

  const onNext = () => setStep(o => o + 1)
  const onPrev = () => setStep(o => o - 1)

  return (
    <Fragment>
      <div className="py-6">
        <Step current={step} total={3} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            <Step1 {...{ onNext, setTargetUser }} />
          ) : (
            <Step2 {...{ targetUser, onNext, onPrev }} />
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default Page
