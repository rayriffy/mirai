import { getDoc, getFirestore, doc, collection } from 'firebase/firestore'
import { GlobeIcon, HomeIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import React, { useMemo, ReactText, Fragment, useState, useEffect } from 'react'
import { useStoreon } from '../../context/storeon'
import { createFirebaseInstance } from '../../core/services/createFirebaseInstance'
import { useLocale } from '../../core/services/useLocale'

export interface Menu {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  link: string
  name: React.ReactNode
  match: string[]
}

export const useMenus = () => {
  const {
    user: {
      metadata: { preferredBranch },
    },
  } = useStoreon('user')

  const { locale, detectedLocale } = useLocale({
    en: {
      home: 'Home',
      arcades: 'Arcades',
      branches: 'Stores',
    },
    th: {
      home: 'หน้าหลัก',
      arcades: 'ตู้เกม',
      branches: 'สาขาร้าน',
    },
  })

  const [branchName, setBranchName] = useState<string>(null)
  useEffect(() => {
    setBranchName('')
    getDoc(
      doc(
        collection(getFirestore(createFirebaseInstance()), 'branches'),
        preferredBranch
      )
    )
      .then(doc => {
        if (doc.exists()) setBranchName(doc.data().name)
      })
      .catch(e => {
        console.error(e)
      })
  }, [preferredBranch])

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
        link: `/dashboard/arcades/${preferredBranch}`,
        name: (
          <Fragment>
            <span className="mr-1">{locale('arcades')}</span>
            <span className="text-gray-500">{branchName}</span>
          </Fragment>
        ),
        match: ['/dashboard/arcades/[arcadeId]'],
      },
      {
        icon: GlobeIcon,
        link: '/dashboard/branches',
        name: locale('branches'),
        match: ['/dashboard/branches'],
      },
    ],
    [detectedLocale, branchName]
  )

  return {
    menus: builtMenus,
  }
}
