import {
  Dispatch,
  FunctionComponent,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
} from 'react'

import { useLocale } from '../../../../../core/services/useLocale'

import { Input } from '../../@types/Input'
import { StoreSelection } from './storeSelection'

interface IProps {
  input: Input
  setInput: Dispatch<SetStateAction<Input>>
  onPrev(): void
  onNext(): void
}

export const Step2: FunctionComponent<IProps> = props => {
  const { setInput, onPrev, onNext } = props
  const { locale } = useLocale({
    en: {
      title: 'Preferred store',
      subtitle:
        'Choose preferred store for better experience. This can be changed in settings',
      prev: 'Previous',
      next: 'Next',
      errorIncompleteFill: 'Some fields are not complete',
    },
    th: {
      title: 'สาขาประจำ',
      subtitle:
        'เลือกสาขาประจำเพื่อเข้าถึงระบบได้ง่ายยิ่งขั้น สามารถแก้ไขในตั้งค่าได้',
      prev: 'ย้อนกลับ',
      next: 'ไปต่อ',
      errorIncompleteFill: 'ข้อมูลกรอกไม่ครบถ้วน',
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = useCallback(() => {
    if (inputRef.current === undefined || inputRef.current === null) {
      return
    }

    const value = inputRef.current.value
    setInput(o => ({
      ...o,
      preferredStore: value,
    }))

    onNext()
  }, [inputRef])

  return (
    <Fragment>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 lg:px-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {locale('title')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{locale('subtitle')}</p>
      </div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <StoreSelection ref={inputRef} />
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {locale('prev')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {locale('next')}
          </button>
        </div>
      </div>
    </Fragment>
  )
}
