import {
  Dispatch,
  SetStateAction,
  FunctionComponent,
  useRef,
  useState,
} from 'react'

import { doc, collection, getDoc } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../core/services/getFirestoreInstance'

import { Scanner } from './scanner'

import { classNames } from '../../../core/services/classNames'
import { useLocale } from '../../../core/services/useLocale'

import { User } from '../../../core/@types/firebase/User'
import { UserWithId } from '../../../core/@types/UserWIthId'

interface Props {
  setTargetUser: Dispatch<SetStateAction<UserWithId>>
  onNext(): void
}

export const Step1: FunctionComponent<Props> = props => {
  const { setTargetUser, onNext } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState(false)

  const { locale } = useLocale({
    en: {
      title: 'Locate user',
      desc: 'Scan user QR code or manually type user id below',
      placeholder: 'User ID',
      next: 'Next',
      prev: 'Previous',
    },
    th: {
      title: 'ระบุผู้ใช้ที่จะเติมเงินให้',
      desc: 'แสกน QR code หรือพิมพ์ id ผู้ใช้ด้านล่าง',
      placeholder: 'รหัสระบุตัวผู้ใช้',
      next: 'ต่อไป',
      prev: 'ย้อนกลับ',
    },
  })

  const handleSubmit = async () => {
    setError(null)
    setInProgress(true)

    try {
      const targetUserId = inputRef.current.value

      console.log(targetUserId)

      const firebaseUidRegex = /^\w{28}$/
      if (firebaseUidRegex.test(targetUserId)) {
        // get user document
        const userDoc = await getDoc(
          doc(collection(getFirestoreInstance(), 'users'), targetUserId)
        )

        // check if user exists
        if (userDoc.exists()) {
          setTargetUser({
            id: targetUserId,
            data: userDoc.data() as User,
          })
          onNext()
        } else {
          setError('User not exist')
        }
      } else {
        setError('Input value is not a valid user id')
      }
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
          {locale('title')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{locale('desc')}</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-center">
          <Scanner
            onScan={value => {
              if (!inProgress) {
                inputRef.current.value = value
                handleSubmit()
              }
            }}
          />
        </div>
        <div className="my-4 border-b border-gray-200"></div>
        <input
          type="text"
          ref={inputRef}
          className={classNames(
            inProgress ? 'bg-gray-200' : 'bg-white',
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
          )}
          placeholder={locale('placeholder')}
        />
        <div className="pt-4 flex justify-center space-x-4">
          <button
            type="button"
            disabled
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-not-allowed"
          >
            {locale('prev')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={inProgress}
            className={classNames(
              inProgress
                ? 'bg-indigo-400 hover:bg-indigo-500'
                : 'bg-indigo-600 hover:bg-indigo-700',
              'transition inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            )}
          >
            {locale('next')}
          </button>
        </div>
      </div>
    </div>
  )
}
