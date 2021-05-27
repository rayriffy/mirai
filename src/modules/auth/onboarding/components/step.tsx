import { FunctionComponent, memo } from 'react'
import { useLocale } from '../../../../core/services/useLocale'

interface Props {
  current: number
  total: number
}

export const Step: FunctionComponent<Props> = memo(props => {
  const { current, total } = props

  const { locale } = useLocale({
    en: {
      step: 'Step',
      of: 'of',
    },
    th: {
      step: 'ขั้นตอนที่',
      of: 'จาก',
    },
  })

  return (
    <nav className="flex items-center justify-center space-x-8">
      <p className="text-sm leading-5 font-medium">
        {locale('step')} {current} {locale('of')} {total}
      </p>
      <ul className="flex items-center space-x-5">
        {Array.from({ length: total }).map((_, i) => (
          <li key={`nav-step-${i}`}>
            {i + 1 === current ? (
              <div className="relative flex items-center justify-center">
                <span className="absolute w-5 h-5 p-px flex">
                  <span className="w-full h-full rounded-full bg-blue-200"></span>
                </span>
                <span className="relative block w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
              </div>
            ) : i + 1 < current ? (
              <span className="block w-2.5 h-2.5 bg-blue-600 rounded-full hover:bg-blue-900 focus:bg-blue-900"></span>
            ) : (
              <span className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400 focus:bg-gray-400"></span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
})
