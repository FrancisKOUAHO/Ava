'use client'

import { FunctionComponent, useState } from 'react'

import Link from 'next/link'
import {
  CalendarDays,
  FilePlus,
  Files,
  FileSearch2,
  Home,
  Users,
} from 'lucide-react'

import { usePathname } from 'next/navigation'

const Sidebar: FunctionComponent = () => {
  const pathname = usePathname()

  const [hide, sethide] = useState<boolean>(false)

  const toggle = () => sethide(!hide)

  return (
    <section className="c-sidebar">
      <div className="logo">
        <img src="/logo/logo_blanc.png" alt="logo skipperndt" />
      </div>

      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'active' : ''}
        onClick={() => sethide(false)}
      >
        <Home />
        Dashboard
      </Link>
      <button
        onClick={toggle}
        className={
          pathname === '/dashboard/invoices' ||
          pathname === '/dashboard/invoices/add' ||
          pathname === '/dashboard/invoices/download'
            ? 'active'
            : ''
        }
      >
        <Files />
        Factures
      </button>
      <div
        className={
          !hide
            ? 'c-sidebar__sub-menu c-sidebar__sub-menu--hide'
            : 'c-sidebar__sub-menu c-sidebar__sub-menu--link active'
        }
      >
        <Link
          href="/dashboard/invoices/add"
          className={pathname === '/dashboard/invoices/add' ? 'active' : ''}
        >
          <FilePlus />
          Créer une facture
        </Link>
        <Link
          href="/dashboard/invoices/summaries"
          className={
            pathname === '/dashboard/invoices/summaries' ? 'active' : ''
          }
        >
          <FileSearch2 />
          Liste des factures
        </Link>
      </div>

      <Link
        href="/dashboard/calendar"
        className={pathname === '/dashboard/calendar' ? 'active' : ''}
        onClick={() => sethide(false)}
      >
        <CalendarDays />
        Calendar
      </Link>

      <Link
        href="/dashboard/customers"
        className={pathname === '/dashboard/customers' ? 'active' : ''}
        onClick={() => sethide(false)}
      >
        <Users />
        Customers
      </Link>

    </section>
  )
}

export default Sidebar
