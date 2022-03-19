import {
  FunctionComponent,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from 'react'

import Link from 'next/link'
import Image from 'next/image'

import {
  TicketIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  LocationMarkerIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotographIcon,
} from '@heroicons/react/outline'
import { FaCoins, FaProductHunt } from 'react-icons/fa'

import { useStoreon } from '../../../context/storeon'
import { classNames } from '../../../core/services/classNames'
import { createApiInstance } from '../../../core/services/createApiInstance'
import { FavoriteButton } from './favoriteButton'

import { ArcadeWithId } from '../../../core/@types/ArcadeWithId'
import { useLocale } from '../../../core/services/useLocale'
import { TransactionSmall } from './transactionSmall'
import { CurrencyIcon } from '../../../core/components/currencyIcon'
import { useCoverImage } from '../../dashboard/arcades/services/useCoverImage'
import { Spinner } from '../../../core/components/spinner'

interface Props {
  arcadeWithId: ArcadeWithId
}

export const InputDialog: FunctionComponent<Props> = props => {
  const { arcadeWithId } = props

  const targetSystem = {
    maxToken: 20,
  }

  const {
    user: {
      auth,
      metadata: { balance_coin, balance_buck = 0 },
    },
  } = useStoreon('user')

  const { data: imageUrl, loading: imageLoading } = useCoverImage(arcadeWithId.id)

  const { locale } = useLocale({
    en: {
      pay: 'Pay',
      back: 'Back to dashboard',
      again: 'Start over',
      before: 'Before',
      after: 'After',
      token: 'Token',
      success: 'Success',
      failed: 'Failed',
      successMessage:
        'Your order was successful. Track your order status in dashboard.',
      failedMessage: 'Your order failed. Please try again.',
    },
    th: {
      pay: 'จ่าย',
      back: 'กลับไปหน้าหลัก',
      again: 'เริ่มต้นใหม่',
      before: 'ก่อน',
      after: 'หลัง',
      token: 'จำนวนเหรียญ',
      success: 'สำเร็จ',
      failed: 'ไม่สำเร็จ',
      successMessage:
        'คำสั่งซื้อถูกสร้างแล้ว สามารถติดตามสถานะคำสั่งซื้อได้ที่หน้าหลัก',
      failedMessage: 'คำสั่งซื้อถูกสร้างไม่สำเร็จ กรุณาลองอีกครั้ง',
    },
  })

  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<'success' | 'failed' | undefined>()
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const [inputToken, setInputToken] = useState<number>(
    // 2800
    arcadeWithId.data.tokenPerCredit
  )

  const balance = useMemo(
    () =>
      arcadeWithId.data.storeCurrency === 'coin'
        ? balance_coin
        : balance_buck,
    [balance_coin, balance_buck, arcadeWithId.data.storeCurrency]
  )
  const calculatedPostBalance = useMemo(
    () => balance - inputToken,
    [balance, inputToken]
  )

  const isIncreaseDisabled = useMemo(
    () =>
      inputToken >= targetSystem.maxToken ||
      calculatedPostBalance < 0 ||
      paymentProcessing,
    [inputToken, calculatedPostBalance, paymentProcessing]
  )
  const onInputIncrease = useCallback(() => {
    const inputResult = inputToken + 1

    if (!isIncreaseDisabled) {
      setInputToken(inputResult)
    }
  }, [inputToken, isIncreaseDisabled])

  const isDecreaseDisabled = useMemo(
    () => inputToken === 1 || paymentProcessing,
    [inputToken, paymentProcessing]
  )
  const onInputDecrease = useCallback(() => {
    const inputResult = inputToken - 1

    if (inputResult !== 0) {
      setInputToken(inputResult)
    }
  }, [inputToken, isIncreaseDisabled])

  const isPayButtonDisabled = useMemo(
    () => calculatedPostBalance < 0 || paymentProcessing,
    [calculatedPostBalance, paymentProcessing]
  )
  const onPayment = useCallback(async () => {
    setPaymentProcessing(true)

    try {
      const apiInstance = await createApiInstance(auth)
      const { data: paymentResult } = await apiInstance.post<{ data: string }>(
        '/api/pay',
        {
          targetArcade: arcadeWithId.id,
          token: inputToken,
        }
      )

      setTransactionId(paymentResult.data)
      setResult('success')
    } catch (e) {
      console.error(e)
      setResult('failed')
    } finally {
      setPaymentProcessing(false)
    }
  }, [inputToken, auth.uid])

  const onReset = () => {
    setPaymentProcessing(false)
    setTransactionId(null)
    setInputToken(arcadeWithId.data.tokenPerCredit)
    setResult(undefined)
  }

  return (
    <div className="mt-6 md:mt-10 border border-gray-200 bg-white rounded-xl overflow-hidden touch-manipulation">
        {!imageLoading && imageUrl !== null ? (
            <Image
              src={imageUrl}
              width={1024}
              height={600}
              alt={arcadeWithId.data.name}
            />
          ) : (
            <div className="aspect-[1024/600] bg-slate-100 flex justify-center items-center">
              {imageLoading ? <Spinner /> : <PhotographIcon className='h-8 w-8 text-gray-900' />}
            </div>
          )}
      <div className="px-4 sm:px-6 py-6">
        <div className="text-center">
          <h3 className="text-2xl leading-6 font-semibold text-gray-900">
            {arcadeWithId.data.name}
          </h3>
          <div className="flex justify-center py-2">
            <LocationMarkerIcon className="text-gray-500 w-6 h-6 mr-1" />
            <Link href={`/dashboard/arcades/${arcadeWithId.data.storeId}`}>
              <a className="text-gray-500">{arcadeWithId.data.storeName}</a>
            </Link>
          </div>
          {result !== undefined ? (
            <Fragment>
              <div className="flex justify-center mt-4">
                {result === 'success' ? (
                  <CheckCircleIcon className="w-10 h-10 text-green-500" />
                ) : (
                  <XCircleIcon className="w-10 h-10 text-red-500" />
                )}
              </div>
              <h1 className="font-bold text-xl text-center text-gray-900 pt-2">
                {locale(result === 'success' ? 'success' : 'failed')}
              </h1>
              <p className="text-gray-700 text-center py-1 mb-2">
                {locale(
                  result === 'success' ? 'successMessage' : 'failedMessage'
                )}
              </p>
              {transactionId !== null ? (
                <TransactionSmall transactionId={transactionId} />
              ) : null}
            </Fragment>
          ) : (
            <Fragment>
              <div className="my-2 mx-6">
                <div className="">
                  <label
                    htmlFor="inputToken"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    {locale('token')}
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
                        className={classNames(
                          paymentProcessing
                            ? 'cursor-wait'
                            : isIncreaseDisabled
                            ? 'cursor-not-allowed'
                            : '',
                          '-ml-px relative inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-none rounded-tr-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:hover:bg-gray-200'
                        )}
                        onClick={onInputIncrease}
                        disabled={isIncreaseDisabled}
                      >
                        <PlusIcon
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        className={classNames(
                          paymentProcessing
                            ? 'cursor-wait'
                            : isDecreaseDisabled
                            ? 'cursor-not-allowed'
                            : '',
                          '-ml-px relative inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-none rounded-br-md text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:hover:bg-gray-200'
                        )}
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
                    <h1>{locale('before')}</h1>
                    <h2 className="text-xl font-semibold flex items-center">
                      {balance.toLocaleString()}
                      <CurrencyIcon
                        currency={arcadeWithId.data.storeCurrency}
                        className="ml-2"
                      />
                    </h2>
                  </div>
                  <div>
                    <ArrowRightIcon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h1>{locale('after')}</h1>
                    <h2 className="text-xl font-semibold flex items-center">
                      {calculatedPostBalance.toLocaleString()}
                      <CurrencyIcon
                        currency={arcadeWithId.data.storeCurrency}
                        className="ml-2"
                      />
                    </h2>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      <div className="mt-5 sm:mt-6">
        {result === undefined && (
          <button
            type="button"
            disabled={isPayButtonDisabled}
            className={classNames(
              calculatedPostBalance < 0
                ? 'cursor-not-allowed'
                : paymentProcessing
                ? 'cursor-wait'
                : '',
              'transition inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:bg-indigo-400 disabled:hover:bg-indigo-500'
            )}
            onClick={onPayment}
          >
            {locale('pay')}
          </button>
        )}
        {result !== undefined && (
          <button
            type="button"
            onClick={onReset}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {locale('again')}
          </button>
        )}
        <div className="flex space-x-2 mt-2">
          <Link href="/dashboard">
            <a
              className={classNames(
                paymentProcessing
                  ? 'bg-gray-200 hover:bg-gray-100 cursor-wait'
                  : 'bg-white hover:bg-gray-50',
                'inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
              )}
            >
              {locale('back')}
            </a>
          </Link>
          <FavoriteButton
            arcadeId={arcadeWithId.id}
            paymentProcessing={paymentProcessing}
          />
        </div>
      </div>
      </div>
    </div>
  )
}
