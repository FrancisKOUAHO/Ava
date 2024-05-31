'use client'

import { FunctionComponent, useState } from 'react'

import Link from 'next/link'
import {
  FilePlus,
  Files,
  FileSearch2,
  Home,
  TextQuote,
  Users,
} from 'lucide-react'

import { usePathname } from 'next/navigation'

const Sidebar: FunctionComponent = () => {
  const pathname = usePathname()

  const [showInvoiceMenu, setShowInvoiceMenu] = useState(false)
  const [showDevisMenu, setShowDevisMenu] = useState(false)
  const [hide, sethide] = useState<boolean>(false)
  const toggle = () => sethide(!hide)

  const toggleInvoiceMenu = () => setShowInvoiceMenu(!showInvoiceMenu)
  const toggleDevisMenu = () => setShowDevisMenu(!showDevisMenu)

  return (
    <section className="c-sidebar">
      <div className="logo">
        <img src="/logo/logo_blanc.png" alt="logo skipperndt" />
      </div>

      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'active' : ''}
        onClick={() => setShowInvoiceMenu(false)}
      >
        <Home />
        Accueil
      </Link>
      <button
        onClick={toggleInvoiceMenu}
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
          !showInvoiceMenu
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
      {/*<Link
        href="/dashboard/calendar"
        className={pathname === '/dashboard/calendar' ? 'active' : ''}
        onClick={() => setShowDevisMenu(false)}
      >
        <CalendarDays />
        Calendar
      </Link>*/}

      <Link
        href="/dashboard/customers"
        className={pathname === '/dashboard/customers' ? 'active' : ''}
        onClick={() => sethide(false)}
      >
        <Users />
        Clients
      </Link>
    </section>
  )
}

export default Sidebar
