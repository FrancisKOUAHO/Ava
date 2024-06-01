'use client'

import { FunctionComponent, useState } from 'react'

import Link from 'next/link'
import {
  BarChartBig,
  Calculator,
  FileBarChart2,
  LayoutDashboard,
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
        <BarChartBig className={pathname === '/dashboard' ? 'active' : ''} />
        Analyse
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
        <FileBarChart2
          className={
            pathname === '/dashboard/invoices' ||
            pathname === '/dashboard/invoices/documents' ||
            pathname === '/dashboard/invoices/articles'
              ? 'active'
              : ''
          }
        />
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
          href="/dashboard/invoices/documents"
          className={
            pathname === '/dashboard/invoices/documents' ? 'active' : ''
          }
        >
          Documents
        </Link>
        <Link
          href="/dashboard/invoices/articles"
          className={
            pathname === '/dashboard/invoices/articles' ? 'active' : ''
          }
        >
          Articles
        </Link>
        {/*<Link href="#">Factures récurrentes</Link>
        <Link href="#">Paiements en ligne</Link>
        <Link href="#">Signatures électroniques</Link>
        <Link href="#">Relances automatiques</Link>*/}
      </div>

      <button
        onClick={toggleInvoiceMenu}
        disabled
        className="cursor-none pointer-events-none"
      >
        <LayoutDashboard />
        Productivité
      </button>
      <div
        className={
          'c-sidebar__sub-menu c-sidebar__sub-menu--hide c-sidebar__sub-menu c-sidebar__sub-menu--link'
        }
      >
        <Link href="#">Transactions</Link>
        <Link href="#">Livres comptables</Link>
        <Link href="#">Déclarations d'impôts</Link>
        <Link href="#">Déclarations Urssaf</Link>
      </div>

      <Link
        href="/dashboard/customers"
        className={pathname === '/dashboard/customers' ? 'active' : ''}
        onClick={() => sethide(false)}
      >
        <Users />
        Contacts
      </Link>

      <button
        onClick={toggleInvoiceMenu}
        className="cursor-none pointer-events-none"
        disabled
      >
        <Calculator />
        Comptabilité
      </button>
      <div
        className={
          'c-sidebar__sub-menu c-sidebar__sub-menu--hide c-sidebar__sub-menu c-sidebar__sub-menu--link'
        }
      >
        <Link href="#">Transactions</Link>
        <Link href="#">Livres comptables</Link>
        <Link href="#">Déclarations d'impôts</Link>
        <Link href="#">Déclarations Urssaf</Link>
      </div>
    </section>
  )
}

export default Sidebar
