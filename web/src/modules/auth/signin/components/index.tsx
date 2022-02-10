import {
  FunctionComponent,
  FormEventHandler,
  Fragment,
  useRef,
  useState,
  useCallback,
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { useLocale } from '../../../../core/services/useLocale'

import { createFirebaseInstance } from '../../../../core/services/createFirebaseInstance'
import { useAuthReader } from '../../../../app/services/useAuthReader'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithRedirect,
  AuthProvider,
} from 'firebase/auth'
import { ssoProviders } from '../constants/ssoProviders'

import { ExclamationIcon, XCircleIcon } from '@heroicons/react/solid'
import { useStoreon } from '../../../../context/storeon'
import { getPamuseUrl } from '../../../../app/services/getPamuseUrl'

export const SigninModule: FunctionComponent = () => {
  useAuthReader()

  const { push } = useRouter()
  const {
    next: { path },
    dispatch,
  } = useStoreon('next')
  const { locale } = useLocale({
    en: {
      signInHead: 'Sign in to your account',
      or: 'Or',
      createAcc: 'create new account',
      email: 'Email address',
      password: 'Password',
      forgot: 'Forgot your password?',
      signIn: 'Sign in',
      orFast: 'Or continue with',
      errorHead: 'Unable to proceed',
      early_heading: 'Early access',
      early_text: 'Mirai system is still under ongoing alpha test. Unauthorized testers are at risk for data loss.',
    },
    th: {
      signInHead: 'เข้าสู่ระบบ',
      or: 'หรือ',
      createAcc: 'สร้างบัญขีใหม่',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      forgot: 'ลืมรหัสผ่าน?',
      signIn: 'เข้าสู่ระบบ',
      orFast: 'หรือเข้าสู่ระบบด้วย',
      errorHead: 'ไม่สามารถทำรายการต่อได้',
      early_heading: 'อยู่ระหว่างทดสอบระบบ',
      early_text: 'ระบบ Mirai ยังอยู่ระหว่างทดสอบระบบ ข้อมูลของผู้ใช้ที่ไม่ได้รับอนุญาตมีโอกาสสูญหายได้ในระหว่างการทดสอบ',
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
        await signInWithEmailAndPassword(getAuth(instance), email, password)

        if (path === undefined) {
          push('/dashboard')
        } else {
          const targetPath = path
          dispatch('next/unset')
          push(targetPath)
        }
      } catch (e) {
        const { message } = e
        setError(message)
        setIsOperation(false)
      }
    },
    [emailRef, passwordRef]
  )

  const onProviderAuth = async (provider: AuthProvider) => {
    setIsOperation(true)
    setError(null)

    const instance = createFirebaseInstance()
    await signInWithRedirect(getAuth(instance), provider)
  }

  return (
    <Fragment>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="mx-auto h-12 w-auto"
            src={getPamuseUrl()}
            width={48}
            height={48}
            alt="Workflow"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {locale('signInHead')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {locale('or')}{' '}
          <Link href="/register">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              {locale('createAcc')}
            </a>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg mx-2 sm:mx-0">
            <div className="px-4 py-5 sm:p-6 flex items-center">
              <ExclamationIcon className="w-10 h-10 text-yellow-600" />
              <div className="ml-4 mx-auto flex-1">
                <h1 className="font-semibold text-lg text-gray-900">{locale('early_heading')}</h1>
                <p className="text-gray-700 text-sm">{locale('early_text')}</p>
              </div>
            </div>
          </div>
        </div>
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
                  autoComplete="current-password"
                  required
                  ref={passwordRef}
                  disabled={isOperation}
                  className="transition appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-wait"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {locale('forgot')}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isOperation}
                className="transition w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:hover:bg-indigo-500"
              >
                {locale('signIn')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {locale('orFast')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {ssoProviders.map(({ id, provider, Icon }) => (
                <div key={`auth-provider-${id}`}>
                  <button
                    disabled={isOperation}
                    onClick={() => onProviderAuth(provider)}
                    className="transition w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-wait"
                  >
                    <span className="sr-only">Sign in with {id}</span>
                    <Icon
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
