'use client'

import { adminLinks } from '@/constants/admin'
import { LucideMenu, LucidePlus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'

function AdminMenu() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [open, setOpen] = useState<boolean>(false)

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 right-0 bottom-0 left-0 z-30 h-screen w-screen`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Open Button */}
      <button
        className={`trans-200 bg-dark-100 hover:bg-primary fixed top-[20%] right-0 z-20 rounded-tl-md rounded-bl-md p-[5px] pl-2 text-white shadow-md ${
          !open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={() => setOpen(!open)}
      >
        <LucideMenu size={20} />
      </button>

      {/* MARK: Main */}
      <div
        className={`fixed top-[20%] text-sm font-semibold z-${
          open ? 30 : 20
        } trans-200 rounded-bl-medium rounded-tl-medium bg-dark-100 shadow-primary right-0 w-full max-w-[300px] p-4 text-white shadow-md ${
          open ? 'translate-x-0 opacity-1' : 'translate-x-full opacity-10'
        }`}
      >
        <Link href="/user" className="group mb-3 flex items-center gap-2">
          <Image
            className="rounded-full shadow-md"
            src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            height={32}
            width={32}
            alt="avatar"
          />
          <span className="font-body text-lg font-semibold tracking-wide">
            {curUser?.firstName && curUser?.lastName
              ? `${curUser.firstName} ${curUser.lastName}`
              : curUser?.username}
          </span>
        </Link>

        {/* Links */}
        <ul>
          {adminLinks.map(({ title, Icon, links }) => (
            <li className="flex items-center gap-2" key={title}>
              {/* "All" Link */}
              <Link
                href={links[0].href}
                className="trans-200 group font-body hover:bg-secondary flex flex-grow items-center gap-2 rounded-lg p-2 tracking-wide"
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {links[0].title}
              </Link>

              {/* "Add" Link */}
              {links[1] && (
                <Link
                  href={links[1].href}
                  className="trans-200 group hover:border-primary flex flex-shrink-0 items-center justify-center rounded-full p-[3px] hover:scale-110"
                  onClick={() => setOpen(false)}
                >
                  <LucidePlus size={12} className="group-hover:text-primary" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default memo(AdminMenu)
