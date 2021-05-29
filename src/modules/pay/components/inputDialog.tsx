import { Fragment, FunctionComponent, useCallback, useMemo, useState } from 'react'

import {
  TicketIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
} from '@heroicons/react/outline'
import { getCalculatedPrice } from '../../../core/services/getCalculatedPrice'

import { ArcadeWithId } from '../../../core/@types/ArcadeWithId'
import { BranchWithId } from '../../../core/@types/BranchWithId'
import { useStoreon } from '../../../context/storeon'

interface Props {
  arcadeWithId: ArcadeWithId
  branchWithId: BranchWithId
}

export const InputDialog: FunctionComponent<Props> = props => {
  const { arcadeWithId, branchWithId } = props

  const targetSystem = {
    maxToken: 20,
  }

  const { user: { metadata: { balance } } } = useStoreon('user')

  const [inputToken, setInputToken] = useState<number>(
    arcadeWithId.data.tokenPerCredit
  )
  const { price, isDiscounted, original } = useMemo(
    () =>
      getCalculatedPrice(
        inputToken,
        arcadeWithId.data.tokenPerCredit,
        arcadeWithId.data.discountedPrice,
      ),
    [inputToken]
  )

  const calculatedPostBalance = useMemo(() => balance - price, [balance, price])

  const isIncreaseDisabled = useMemo(
    () => inputToken >= targetSystem.maxToken || calculatedPostBalance < 0,
    [inputToken, calculatedPostBalance]
  )
  const onInputIncrease = useCallback(() => {
    const inputResult = inputToken + 1

    if (!isIncreaseDisabled) {
      setInputToken(inputResult)
    }
  }, [inputToken, isIncreaseDisabled])

  const isDecreaseDisabled = useMemo(() => inputToken === 1 || calculatedPostBalance < 0, [inputToken])
  const onInputDecrease = useCallback(() => {
    const inputResult = inputToken - 1

    if (inputResult !== 0) {
      setInputToken(inputResult)
    }
  }, [inputToken, isIncreaseDisabled])

  return (
            <div className="mt-10 border border-gray-200 bg-white rounded-md px-4 py-5 sm:p-6 overflow-hidden">
              <div>
                {/* <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div> */}
                <div className="text-center sm:mt-4">
                  <h3
                    className="text-2xl leading-6 font-semibold text-gray-900 py-3 sm:pt-0"
                  >
                    {arcadeWithId.data.name}
                  </h3>
                  <div className="my-6 text-center flex justify-center">
                    <div className="relative mt-2">
                      <h1 className="text-3xl font-bold">฿{price.toLocaleString()}</h1>
                      {isDiscounted && (
                        <h2 className="absolute -right-8 -top-5 text-lg font-medium line-through text-gray-700">
                          ฿{original.toLocaleString()}
                        </h2>
                      )}
                    </div>
                  </div>
                  <div className="my-2 mx-6">
                    <div className="">
                      <label
                        htmlFor="inputToken"
                        className="block text-sm font-medium text-gray-700 text-left"
                      >
                        Token
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <TicketIcon
                              className="h-6 w-6 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            name="token"
                            id="inputToken"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-12 sm:text-base border-gray-300"
                            placeholder="3"
                            value={inputToken.toString()}
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <button
                            className="-ml-px relative inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-none rounded-tr-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:hover:bg-gray-200"
                            onClick={onInputIncrease}
                            disabled={isIncreaseDisabled}
                          >
                            <PlusIcon
                              className="h-4 w-4 text-gray-400"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            className="-ml-px relative inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-none rounded-br-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:hover:bg-gray-200"
                            onClick={onInputDecrease}
                            disabled={isDecreaseDisabled}
                          >
                            <MinusIcon
                              className="h-4 w-4 text-gray-400"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 py-4 max-w-xs mx-auto">
                    <div className="space-x-4 flex items-center justify-center">
                      <div className="text-center">
                        <h1>Before</h1>
                        <h2 className="text-xl font-semibold">฿{balance.toLocaleString()}</h2>
                      </div>
                      <div>
                        <ArrowRightIcon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <h1>After</h1>
                        <h2 className="text-xl font-semibold">฿{calculatedPostBalance.toLocaleString()}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Pay
                </button>
                <button
                  type="button"
                  className="mt-1 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
  )
}