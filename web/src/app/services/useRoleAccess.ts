import { useMemo } from 'react'
import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'

import { Role } from '../../core/@types/Role'

interface Route {
  startsWith: string
  roles: Role[]
}

// use in dashboard wrapper
export const useRoleAccess = () => {
  const restrictedRoutes: Route[] = [
    {
      startsWith: '/dashboard/admin',
      roles: ['admin', 'superstaff'],
    },
    {
      startsWith: '/dashboard/staff',
      roles: ['staff', 'superstaff'],
    },
  ]

  const {
    user: {
      metadata: { role },
    },
  } = useStoreon('user')
  const { pathname } = useRouter()

  const isAuthorized = useMemo(() => {
    const requiredAuthorizedRoute = restrictedRoutes.find(route =>
      pathname.startsWith(route.startsWith)
    )

    if (requiredAuthorizedRoute) {
      return requiredAuthorizedRoute.roles.includes(role)
    } else {
      return true
    }
  }, [pathname, role])

  return {
    authorized: isAuthorized,
  }
}
