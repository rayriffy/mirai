import {
  FormEventHandler,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
} from 'react'

import { useLocale } from '../../../../core/services/useLocale'

import { Input } from '../@types/Input'

interface IProps {
  input: Input
  setInput: React.Dispatch<SetStateAction<Input>>
  onNext(): void
}

export const Step1: React.FC<IProps> = props => {
  const { input, setInput, onNext } = props
  const { locale } = useLocale({
    en: {
      title: 'Display name',
      subtitle:
        'Could be set to any name since it will being used for display only',
      next: 'Next',
      errorIncompleteFill: 'Some fields are not complete',
    },
    th: {
      title: 'ตั้งชื่อแสดงผล',
      subtitle: 'สามารถตั้งเป็นชื่ออะไรก็ได้ ไว้ใช้ในการแสดงผลเท่านั้น',
      next: 'ไปต่อ',
      errorIncompleteFill: 'ข้อมูลกรอกไม่ครบถ้วน',
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    e => {
      e.preventDefault()
      const value = inputRef.current.value
      setInput(o => ({
        ...o,
        displayName: value,
      }))

      onNext()
    },
    [inputRef]
  )

  return (
    <Fragment>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 lg:px-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {locale('title')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{locale('subtitle')}</p>
      </div>
      <form className="px-4 py-6 sm:px-6 lg:px-8" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="sr-only">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={input.displayName}
              required
              ref={inputRef}
              className="shadow-sm focus:ring-gray-500 block w-full sm:text-sm border-gray-300 rounded-md focus:border-gray-500"
              placeholder="Display name"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {locale('next')}
          </button>
        </div>
      </form>
    </Fragment>
  )
}
