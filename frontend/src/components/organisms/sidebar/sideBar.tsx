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

    const [showInvoiceMenu, setShowInvoiceMenu] = useState(false);
    const [showDevisMenu, setShowDevisMenu] = useState(false);
    const [hide, sethide] = useState<boolean>(false)
    const toggle = () => sethide(!hide)

    // Toggle functions for each submenu
    const toggleInvoiceMenu = () => setShowInvoiceMenu(!showInvoiceMenu);
    const toggleDevisMenu = () => setShowDevisMenu(!showDevisMenu);

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
        Dashboard
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

        <button
        onClick={toggleDevisMenu}
        className={
          pathname === '/dashboard/devis' ||
          pathname === '/dashboard/devis/add' ||
          pathname === '/dashboard/devis/download'
            ? 'active'
            : ''
        }
      >
        <Files />
        Devis
      </button>
      <div
        className={
          !showDevisMenu
            ? 'c-sidebar__sub-menu c-sidebar__sub-menu--hide'
            : 'c-sidebar__sub-menu c-sidebar__sub-menu--link active'
        }
      >
        <Link
          href="/dashboard/devis/add"
          className={pathname === '/dashboard/devis/add' ? 'active' : ''}
        >
          <FilePlus />
          Créer une devis
        </Link>
        <Link
          href="/dashboard/devis/summaries"
          className={
            pathname === '/dashboard/devis/summaries' ? 'active' : ''
          }
        >
          <FileSearch2 />
          Liste des devis
        </Link>
      </div>

      <Link
        href="/dashboard/calendar"
        className={pathname === '/dashboard/calendar' ? 'active' : ''}
        onClick={() => setShowDevisMenu(false)}
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
