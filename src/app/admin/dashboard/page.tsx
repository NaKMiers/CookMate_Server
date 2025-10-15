'use client'

import { adminLinks } from '@/constants/admin'
import { LucideLogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

function AdminDashboard() {
  return (
    <div className="mx-auto mt-8 w-screen max-w-2xl">
      <div className="text-card-foreground rounded-xl border bg-white shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-3xl leading-none font-bold tracking-tight text-neutral-300">
            Admin Dashboard
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-6">
            {adminLinks.map(section => (
              <div key={section.title}>
                <div className="mb-3 flex items-center gap-2">
                  <section.Icon className="h-5 w-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-700">
                    {section.title}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center rounded-md border px-4 py-1.5 text-base font-medium text-gray-800 transition-colors hover:bg-sky-100"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <LucideLogOut className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-700">Sign Out</h4>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center rounded-md border px-4 py-1.5 text-base font-medium text-gray-800 transition-colors hover:bg-rose-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
