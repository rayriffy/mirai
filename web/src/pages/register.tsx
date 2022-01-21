import { FormEventHandler, useCallback, useRef, useState } from 'react'

import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { XCircleIcon } from '@heroicons/react/outline'

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

import { useLocale } from '../core/services/useLocale'
import { createFirebaseInstance } from '../core/services/createFirebaseInstance'

const Page: NextPage = () => {
  const { push } = useRouter()
  const { locale } = useLocale({
    en: {
      signUpHead: 'Create new account',
      email: 'Email address',
      password: 'Password',
      signUp: 'Sign up',
      agreement1: 'By signing up, you agree to our',
      agreement2: 'Terms',
      agreement3: 'and',
      agreement4: 'Data Policy',
      errorHead: 'Unable to proceed',
    },
    th: {
      signUpHead: 'สร้างบัญชีใหม่',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      signUp: 'สมัครสมาชิก',
      agreement1: 'ในการสมัคร คุณได้ยอมรับ',
      agreement2: 'เงื่อนไขการใช้งาน',
      agreement3: 'และ',
      agreement4: 'นโยบายข้อมูล',
      errorHead: 'ไม่สามารถทำรายการต่อได้',
    },
  })

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [isOperation, setIsOperation] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async e => {
      e.preventDefault()

      setIsOperation(true)
      setError(null)

      const email = emailRef.current.value
      const password = passwordRef.current.value

      try {
        const instance = createFirebaseInstance()
        await createUserWithEmailAndPassword(getAuth(instance), email, password)
        push('/onboarding')
      } catch (e) {
        const { message } = e
        setError(message)
        setIsOperation(false)
      }
    },
    [emailRef, passwordRef]
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="mx-auto h-12 w-auto"
            src='/static/pamuse.svg'
            width={48}
            height={48}
            alt="Workflow"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {locale('signUpHead')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error !== null && (
            <div className="rounded-md bg-yellow-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {locale('errorHead')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {locale('email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailRef}
                  disabled={isOperation}
                  className="transition appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-wait"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {locale('password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  ref={passwordRef}
                  disabled={isOperation}
                  className="transition appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-wait"
                />
              </div>
            </div>

            <div className="flex items-center justify-start">
              <div className="flex items-center">
                <input
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  required
                  disabled={isOperation}
                  className="transition h-4 w-4 text-indigo-600' focus:ring-indigo-500 border-gray-300 rounded disabled:text-indigo-400 disabled:cursor-wait"
                />
                <label
                  htmlFor="agreement"
                  className="ml-2 block text-sm text-gray-500"
                >
                  {locale('agreement1')}{' '}
                  <a className="text-gray-900 hover:underline cursor-pointer">
                    {locale('agreement2')}
                  </a>{' '}
                  {locale('agreement3')}{' '}
                  <a className="text-gray-900 hover:underline cursor-pointer">
                    {locale('agreement4')}
                  </a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isOperation}
                className="transition w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:hover:bg-indigo-500"
              >
                {locale('signUp')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
