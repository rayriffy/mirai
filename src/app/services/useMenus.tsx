import {
  ReactNode,
  FunctionComponent,
  SVGProps,
  useMemo,
  Fragment,
  useState,
  useEffect,
} from 'react'

import {
  GlobeIcon,
  HomeIcon,
  LocationMarkerIcon,
  PuzzleIcon,
} from '@heroicons/react/outline'

import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'
import { getDoc, getFirestore, doc, collection } from 'firebase/firestore'

import { useStoreon } from '../../context/storeon'
import { useLocale } from '../../core/services/useLocale'

export interface Menu {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
  link: string
  name: ReactNode
  match: string[]
}

export const useMenus = () => {
  const {
    user: {
      metadata: { preferredStore, role },
    },
  } = useStoreon('user')

  const { locale, detectedLocale } = useLocale({
    en: {
      home: 'Home',
      arcades: 'Arcades',
      stores: 'Stores',
      staff: 'Staff mode',
    },
    th: {
      home: 'หน้าหลัก',
      arcades: 'ตู้เกม',
      stores: 'สาขาร้าน',
      staff: 'สำหรับพนักงาน',
    },
  })

  const [storeName, setStoreName] = useState<string>(null)
  useEffect(() => {
    setStoreName('')
    getDoc(
      doc(
        collection(getFirestore(createFirebaseInstance()), 'stores'),
        preferredStore
      )
    )
      .then(doc => {
        if (doc.exists()) setStoreName(doc.data().name)
      })
      .catch(e => {
        console.error(e)
      })
  }, [preferredStore])

  const builtMenus: Menu[] = useMemo(
    () => [
      {
        icon: HomeIcon,
        link: '/dashboard',
        name: locale('home'),
        match: ['/dashboard'],
      },
      {
        icon: LocationMarkerIcon,
        link: `/dashboard/arcades/${preferredStore}`,
        name: (
          <Fragment>
            <span className="mr-1">{locale('arcades')}</span>
            <span className="text-gray-500">{storeName}</span>
          </Fragment>
        ),
        match: ['/dashboard/arcades/[arcadeId]'],
      },
      {
        icon: GlobeIcon,
        link: '/dashboard/stores',
        name: locale('stores'),
        match: ['/dashboard/stores'],
      },
      ...(role !== 'default'
        ? [
            {
              icon: PuzzleIcon,
              link: '/staff',
              name: locale('staff'),
              match: ['/dashboard/stores'],
            },
          ]
        : []),
    ],
    [detectedLocale, storeName, role]
  )

  return {
    menus: builtMenus,
  }
}
