import { Fragment, FunctionComponent, useRef, useState } from 'react'

import { UserWithId } from '../../../core/@types/UserWIthId'
import { classNames } from '../../../core/services/classNames'

import { useStoreon } from '../../../context/storeon'
import { createApiInstance } from '../../../core/services/createApiInstance'
import { FaCoins } from 'react-icons/fa'
import { useLocale } from '../../../core/services/useLocale'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline'

interface Props {
  targetUser: UserWithId
  onPrev(): void
  onNext(): void
}

export const Step2: FunctionComponent<Props> = props => {
  const { targetUser, onNext, onPrev } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [confirmDialogShow, setConfirmDialogShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState(false)

  const {
    user: { auth },
  } = useStoreon('user')

  const { locale } = useLocale({
    en: {
      title: 'Add coin',
      desc: 'Put amout of coin to add',
      amount: 'Amount of coin',
      next: 'Next',
      prev: 'Previous',
      diaTitle: 'Confirmation',
      disDesc1: 'You are about to add',
      disDesc2: 'coins',
      disDesc3: 'to user. Please make sure this is correct before you continue',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    th: {
      title: 'เพิ่มเหรียญ',
      desc: 'ระบุจำนวนเหรียญที่จะเติมให้ลูกค้า',
      amount: 'จำนวนเหรียญ',
      next: 'ต่อไป',
      prev: 'ย้อนกลับ',
      diaTitle: 'เช็คข้อมูลอีกครั้ง',
      disDesc1: 'คุณกำลังจะเพิ่ม',
      disDesc2: 'เหรียญ',
      disDesc3: 'ให้กับผู้ใช้ กรุณาตรวจสอบข้อมูลว่าถูกต้องก่อนดำเนินการต่อ',
      confirm: 'ยืนยัน',
      cancel: 'ยกเลิก',
    },
  })

  const cancelButtonRef = useRef<HTMLButtonElement>(null)

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
    <Fragment>
      <div className="border border-gray-200 bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {locale('title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{locale('desc')}</p>
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
                    <div className="ml-2 truncate">
                      <h1 className="font-semibold">
                        {targetUser.data.displayName}
                      </h1>
                      <p className="text-gray-500 text-sm truncate break-all">
                        {targetUser.id}
                      </p>
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
            defaultValue="10"
            ref={inputRef}
            className={classNames(
              inProgress ? 'bg-gray-200' : 'bg-white',
              'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
            )}
            placeholder={locale('amount')}
          />
          <div className="pt-4 flex justify-center space-x-4">
            <button
              type="button"
              onClick={onPrev}
              disabled={inProgress}
              className={classNames(
                inProgress
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-white hover:bg-gray-50',
                'bg-white hover:bg-gray-50',
                'inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              )}
            >
              {locale('prev')}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDialogShow(true)}
              disabled={inProgress}
              className={classNames(
                inProgress
                  ? 'bg-indigo-400 hover:bg-indigo-500 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700',
                'transition inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              )}
            >
              {locale('next')}
            </button>
          </div>
        </div>
      </div>

      <Transition.Root show={confirmDialogShow} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setConfirmDialogShow}
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
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                    <ExclamationCircleIcon
                      className="h-6 w-6 text-orange-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {locale('diaTitle')}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {locale('disDesc1')}{' '}
                        <b>
                          {inputRef.current?.value ?? 0} {locale('disDesc2')}
                        </b>{' '}
                        {locale('disDesc3')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 mx-auto max-w-md flex justify-center text-xl space-x-2">
                  <div className="flex items-center">
                    {inputRef.current?.value ?? 0}
                    <FaCoins className="ml-2" />
                  </div>
                  <div>=</div>
                  <div className="flex items-center">
                    {(
                      Number(inputRef.current?.value ?? 0) * 10
                    ).toLocaleString()}{' '}
                    ฿
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className={classNames(
                      inProgress
                        ? 'bg-indigo-400 hover:bg-indigo-500 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-700',
                      'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm'
                    )}
                    onClick={() => handleSubmit()}
                  >
                    {locale('confirm')}
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      inProgress ? "bg-gray-100 hover:bg-gray-200 cursor-wait" :
                      "bg-white hover:bg-gray-50",
                      "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    )}
                    onClick={() => setConfirmDialogShow(false)}
                    ref={cancelButtonRef}
                  >
                    {locale('cancel')}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  )
}
