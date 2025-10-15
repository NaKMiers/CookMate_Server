import { LucideLayoutDashboard, LucideUsers2 } from 'lucide-react'

export const adminLinks = [
  {
    title: 'Dashboard',
    Icon: LucideLayoutDashboard,
    links: [
      {
        title: 'Dashboard',
        href: '/admin/dashboard',
      },
    ],
  },
  {
    title: 'Users',
    Icon: LucideUsers2,
    links: [
      {
        title: 'Users Management',
        href: '/admin/users',
      },
    ],
  },
]
