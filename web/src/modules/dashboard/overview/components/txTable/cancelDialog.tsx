import { FunctionComponent, Fragment, useState, useCallback } from 'react'

import { XIcon, ExclamationIcon } from '@heroicons/react/outline'
import { Transition, Dialog } from '@headlessui/react'

import { createApiInstance } from '../../../../../core/services/createApiInstance'
import { useStoreon } from '../../../../../context/storeon'
import { FaCoins, FaProductHunt } from 'react-icons/fa'
import { CurrencyIcon } from '../../../../../core/components/currencyIcon'

interface Props {
  transactionId: string
  transactionCurrency: 'coin' | 'buck'
  transactionValue: number
  open: boolean
  onClose?(): void
}

export const CancelDialog: FunctionComponent<Props> = props => {
  const {
    open,
    onClose = () => {},
    transactionId,
    transactionValue,
    transactionCurrency,
  } = props

  const {
    user: { auth },
  } = useStoreon('user')

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>(null)

  const onCancel = useCallback(async () => {
    setProcessing(true)

    try {
      const instance = await createApiInstance(auth)

      await instance.post('/api/cancel', {
        transactionId,
      })
    } catch (e) {
      setError(e.response.data)
    } finally {
      setProcessing(false)
    }
  }, [transactionId])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={() => (!processing ? onClose() : null)}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Cancel transaction
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancael this transaction?{' '}
                      <b className="inline-flex items-center">
                        {transactionValue}{' '}
                        <CurrencyIcon currency={transactionCurrency} className="ml-1" />
                      </b>{' '}
                      will be returned to your balance. This action cannot be
                      undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={processing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-500 disabled:hover:bg-red-600 disabled:focus:ring-red-400"
                  onClick={onCancel}
                >
                  Cancel order
                </button>
                <button
                  type="button"
                  disabled={processing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:bg-gray-100"
                  onClick={onClose}
                >
                  No, go back
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
