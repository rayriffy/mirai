import { FunctionComponent, useRef, useState } from 'react'

import { UserWithId } from '../../../core/@types/UserWIthId'
import { classNames } from '../../../core/services/classNames'

import { useStoreon } from '../../../context/storeon'
import { createApiInstance } from '../../../core/services/createApiInstance'
import { FaCoins } from 'react-icons/fa'

interface Props {
  targetUser: UserWithId
  onPrev(): void
  onNext(): void
}

export const Step2: FunctionComponent<Props> = props => {
  const { targetUser, onNext, onPrev } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState(false)

  const {
    user: { auth },
  } = useStoreon('user')

  const handleSubmit = async () => {
    setInProgress(true)
    try {
      const apiInstance = await createApiInstance(auth)
      await apiInstance.post('/api/topup', {
        userId: targetUser.id,
        amount: Number(inputRef.current.value),
      })
      onNext()
    } catch (e) {
      console.error(e)
    } finally {
      setInProgress(false)
    }
  }

  return (
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
        <div className="mb-4">
          <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
            <div className="px-4 py-5 flex">
              <div className="w-full flex justify-between items-center ml-2">
                <div className="flex items-center">
                  <img
                    className="w-10 h-10 bg-gray-300 rounded-full"
                    src={`https://www.gravatar.com/avatar/${targetUser.data.emailHash}`}
                    width={40}
                    height={40}
                    alt=""
                  />
                  <div className="ml-2">
                    <h1 className="font-semibold">
                      {targetUser.data.displayName}
                    </h1>
                    <p className="text-gray-500 text-sm">{targetUser.id}</p>
                  </div>
                </div>
                <span className="text-lg flex items-center">
                  {targetUser.data.balance_coin} <FaCoins className="ml-2" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <input
          type="text"
          inputMode="numeric"
          ref={inputRef}
          className={classNames(
            inProgress ? 'bg-gray-200' : 'bg-white',
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
          )}
          placeholder="Amount"
        />
        <div className="pt-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            // onClick={onNext}
            disabled={inProgress}
            className={classNames(
              inProgress
                ? 'bg-indigo-400 hover:bg-indigo-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700',
              'transition inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
