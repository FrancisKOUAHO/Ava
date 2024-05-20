'use client'

import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import api from '@/config/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import { CirclePlus, MoreHorizontal, Trash, Edit,FileImage } from 'lucide-react'
import {ClientProps} from "@/types/ClientProps";
import DeleteCustomer from "@/components/molecules/modal/customer/DeleteCustomer";
import {deleteClient} from "@/lib/customer";
import Link from 'next/link'

interface Client {
  id: string
  firstName: string
  lastName: string
}

type InvoiceStatus = 'envoyé' | 'brouillon' | 'payé' | 'caduque' | 'en cours de paiement'

interface Invoice {
  client: Client
  clientId: string
  createdAt: string
  date: string | null
  discount: string
  dueDate: string | null
  id: string
  invoiceDate: string | null
  invoiceNumber: string | null
  notes: string
  status: InvoiceStatus
  terms: string
  total: string
  totalAmount: string
  updatedAt: string
  userId: string | undefined
}

const Page = () => {
  const [checked, setChecked] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('billing/invoice-data')
        const data = await response.data
        setInvoices(data)
      } catch (error) {
        console.error('Failed to fetch invoices', error)
      }
    }

    fetchInvoices()
  }, [])
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return ''
    }

    const date = new Date(dateString)

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const toggleDropdown = (id: string | undefined) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id || null))
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await api.put(`billing/invoice/${id}`, { status });
      if (response.status === 200) {
        // Update the state with the new status
        setInvoices(invoices => invoices.map(invoice => {
          if (invoice.id === id) {
            return { ...invoice, status };
          }
          return invoice;
        }));
      } else {
        // Handle possible errors
        console.error('Failed to update the invoice status:', response);
      }
    } catch (error) {
      console.error('Error updating the invoice status:', error);
    }
  };


  const openDeleteModal = (invoiceId: string | undefined) => {
    setInvoiceIdToDelete(invoiceId || null)
    setDeleteModalOpen(true)
  }


  const handleDeleteConfirm = async () => {
    try {
      if (invoiceIdToDelete) {
        try {
          const response = await api.delete(`billing/invoice/${invoiceIdToDelete}`)
          //return convertKeysToSnakeCase(response.data)
        } catch (error: unknown) {
          throw new Error('Failed to delete client: ' + error)
        }
        setInvoices((invoices: Invoice[]): Invoice[] =>
            invoices.filter((invoice) => invoice.id !== invoiceIdToDelete),
        )
        setDeleteModalOpen(false)
        setInvoiceIdToDelete(null)
      }
    } catch (error) {}
  }

  return (
    <section className="px-6 py-6">
      <header className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-12">
          <h5 className="text-black text-lg font-semibold">Factures</h5>
          <a
            href="/dashboard/invoices/add"
            className="flex justify-center gap-1 items-center text-black text-sm"
          >
            <CirclePlus className="w-3 h-3" />
            Créer une Facture
          </a>
        </div>
        <div className="relative text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <svg
              className="text-gray-600 h-4 w-4 fill-current"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              xmlSpace="preserve"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="mt-6">
        <table className="table w-full text-black border-separate space-y-6 text-sm">
          <thead>
            <tr>
              {/*<th className="flex items-center gap-2 p-3 text-center">*/}
              {/*  <Checkbox id="default-checkbox" checked={checked} />*/}
              {/*  <Label*/}
              {/*    htmlFor="default-checkbox"*/}
              {/*    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
              {/*  >*/}
              {/*    Select All*/}
              {/*  </Label>*/}
              {/*</th>*/}
              <th className="p-3 text-center">Nom</th>
              <th className="p-3 text-center">Prix</th>
              <th className="p-3 text-center">Client</th>
              <th className="p-3 text-center">Statut</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: Invoice) => (
              <tr key={invoice.id} className="bg-[#e7effc]">
                <td className="flex items-center gap-2 p-3 text-center">
                  <Checkbox
                    id={`checkbox-${invoice.id}`}
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <Label
                    htmlFor={`checkbox-${invoice.id}`}
                    className="text-sm font-medium"
                  >
                    <FileImage className="w-8 h-8" />
                  </Label>
                </td>
                <td className="p-3 text-center">
                  {invoice?.client?.firstName}
                </td>
                <td className="p-3 text-center">{invoice?.totalAmount}€</td>
                <td className="p-3 text-center">
                  {invoice?.client?.firstName} {invoice?.client?.lastName}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`bg-${invoice?.status === 'payé' ? 'green-200' : 'red-200'} text-${invoice?.status === 'payé' ? 'green-600' : 'red-600'} py-1 px-3 rounded-full text-xs`}
                  >
                    {invoice?.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {formatDate(invoice?.createdAt ?? '')}
                </td>
                <td className="p-3 text-center">
                  <DropdownMenu
                      open={openDropdownId === invoice.id}
                      onOpenChange={() => toggleDropdown(invoice.id)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => openDeleteModal(invoice.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        >
                          <Link
                              href={`/dashboard/invoices/edit/${invoice.id}`}
                              className="flex items-center" // Add these classes
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span> {/* Wrapped text in a span for better control */}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuLabel>Statut</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => updateStatus(invoice.id,"envoyé")}
                        >
                          Envoyé
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateStatus(invoice.id,"brouillon")}

                        >
                            <span>Brouillon</span> {/* Wrapped text in a span for better control */}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateStatus(invoice.id,"payé")}

                        >
                          <span>Payé</span> {/* Wrapped text in a span for better control */}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateStatus(invoice.id,"caduque")}

                        >
                            <span>Caduque</span> {/* Wrapped text in a span for better control */}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/*<td className="p-3 text-center">*/}
                {/*  <a*/}
                {/*    href={`/invoices/${invoice?.id}`}*/}
                {/*    className="text-indigo-600 hover:text-indigo-900"*/}
                {/*  >*/}
                {/*    View*/}
                {/*  </a>*/}
                {/*</td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteCustomer
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
      />
    </section>
  )
}

export default Page
