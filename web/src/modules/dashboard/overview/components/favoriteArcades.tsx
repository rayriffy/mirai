import { memo } from 'react'

import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'

import { FavoriteArcadeItem } from './favoriteArcadeItem'

export const FavoriteArcades = memo(() => {
  const { locale } = useLocale({
    en: {
      title: 'Favorite Arcades',
      noArcade: 'Add favorite arcade for faster access',
    },
    th: {
      title: 'ตู้เกมโปรด',
      noArcade: 'เพิ่มตู้เกมที่ชื่นชอบเพื่อเข้าถึงได้เร็วขึ้น',
    },
  })

  const {
    user: {
      metadata: { favoriteArcades },
    },
  } = useStoreon('user')

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {locale('title')}
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-4 mt-3">
        {(favoriteArcades ?? []).length === 0 ? (
          <li className="col-span-1">
            <div className="border-2 border-gray-400 border-dotted rounded-md h-14 flex justify-center items-center text-sm text-gray-500 px-4">
              {locale('noArcade')}
            </div>
          </li>
        ) : (
          (favoriteArcades ?? []).map(arcade => (
            <FavoriteArcadeItem
              key={`favoriteArcade-${arcade}`}
              arcadeId={arcade}
            />
          ))
        )}
      </ul>
    </div>
  )
})
