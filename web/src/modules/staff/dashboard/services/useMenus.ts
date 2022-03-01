import {
  useMemo,
} from 'react'

import {
  CurrencyYenIcon,
  ChartBarIcon,
} from '@heroicons/react/outline'
import { useStoreon } from '../../../../context/storeon'
import { useLocale } from '../../../../core/services/useLocale'

export const useMenus = () => {
  const {
    user: {
      metadata: { staffStoreId },
    },
  } = useStoreon('user')

  const { locale, detectedLocale } = useLocale({
    en: {
      topupTitle: 'Topup',
      topupDesc: 'Add coins into user account',
      analyticsTitle: 'Analytics',
      analyticsDesc: 'Monitor store performance',
    },
    th: {
      topupTitle: 'เติมเหรียญ',
      topupDesc: 'เติมเหรียญให้กับลูกค้า',
      analyticsTitle: 'วิเคราะห์',
      analyticsDesc: 'ติดตามสถานะการทำงานของร้าน',
    },
  })

  const builtMenus = useMemo(
    () => [
      {
        id: 'topup',
        link: '/dashboard/staff/topup',
        icon: CurrencyYenIcon,
        title: locale('topupTitle'),
        description: locale('topupDesc'),
      },
      ...(typeof staffStoreId === 'string' ? [{
        id: 'analytic',
        link: `/dashboard/staff/analytic/${staffStoreId}`,
        icon: ChartBarIcon,
        title: locale('analyticsTitle'),
        description: locale('analyticsDesc'),
      }] : [])
    ],
    [detectedLocale, staffStoreId]
  )

  return {
    menus: builtMenus,
  }
}
