import { HomeIcon } from '@heroicons/react/outline'

export interface Menu {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  link: string
  name: string
  match: string[]
}

export const menus: Menu[] = [
  {
    icon: HomeIcon,
    link: '/dashboard',
    name: 'Home',
    match: ['/dashboard'],
  },
]
