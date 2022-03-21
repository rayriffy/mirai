import { memo } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { PhotographIcon } from '@heroicons/react/outline'
import { Spinner } from '../../../../core/components/spinner'

import { useLocale } from '../../../../core/services/useLocale'
import { useCoverImage } from '../services/useCoverImage'

import { ArcadeWithId } from '../../../../core/@types/ArcadeWithId'
import { ArcadeHealth } from '../../../pay/components/arcadeHealth'

interface Props {
  arcade: ArcadeWithId
}

export const ArcadeCard = memo<Props>(props => {
  const { arcade } = props

  const { locale } = useLocale({
    en: {
      pergame: 'coins per game',
    },
    th: {
      pergame: 'เหรียญต่อการเข้าเล่นหนึ่งรอบ',
    },
  })

  const { loading, data } = useCoverImage(arcade.id)

  return (
    <Link href={`/pay/${arcade.id}`}>
      <a>
        <div className="border border-gray-200 bg-white rounded-xl w-full overflow-hidden">
          {!loading && data !== null ? (
            <Image
              src={data}
              width={1024}
              height={600}
              alt={arcade.data.name}
            />
          ) : (
            <div className="aspect-[1024/600] bg-slate-100 flex justify-center items-center">
              {loading ? <Spinner /> : <PhotographIcon className='h-8 w-8 text-gray-900' />}
            </div>
          )}
          <div className="px-5 py-3 flex justify-between">
            <div>
              <h1 className="text-gray-800 font-semibold text-xl">
                {arcade.data.name}
              </h1>
              <div className="mt-0.5">
                <h2 className="text-gray-500 text-sm">
                  {arcade.data.tokenPerCredit} {locale('pergame')}
                </h2>
              </div>
            </div>
            <div className="flex items-center">
              <ArcadeHealth arcadeId={arcade.id} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
})
