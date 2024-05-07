'use client'

import { CirclePlus, FileImage } from 'lucide-react'
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import api from "@/config/api";

const Page = () => {
  const [checked, setChecked] = useState(false)
  const [invoices, setInvoices] = useState([]);  // State to store invoice data


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('billing/invoice-data');
        const data = await response.data;
        console.log('data');
        console.log(data);
        setInvoices(data);  // Store fetched data in state
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      }
    };

    fetchInvoices();
  }, []);
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
            Créer une facture
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
              <th className="flex items-center gap-2 p-3 text-center">
                <Checkbox id="default-checkbox" checked={checked} />
                <Label
                  htmlFor="default-checkbox"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All
                </Label>
              </th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Client</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {invoices.map((invoice) => (  // Map over invoices to render rows
              <tr key={invoice.id} className="bg-[#e7effc]">
                <td className="flex items-center gap-2 p-3 text-center">
                  <Checkbox id={`checkbox-${invoice.id}`} checked={checked} onChange={() => setChecked(!checked)} />
                  <Label htmlFor={`checkbox-${invoice.id}`} className="text-sm font-medium">
                    <FileImage className="w-8 h-8" />
                  </Label>
                </td>
                <td className="p-3 text-center">{invoice.client.firstName}</td>
                <td className="p-3 text-center">{invoice.total}€</td>
                <td className="p-3 text-center">{invoice.client.firstName + invoice.client.lastName}</td>
                <td className="p-3 text-center">
                  <span className={`bg-${invoice.status === 'Paid' ? 'green-200' : 'red-200'} text-${invoice.status === 'Paid' ? 'green-600' : 'red-600'} py-1 px-3 rounded-full text-xs`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-3 text-center">{formatDate(invoice.date)}</td>
                <td className="p-3 text-center">
                  <a href={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900">
                    View
                  </a>
                </td>
              </tr>
          ))}
          </tbody>        </table>
      </div>
    </section>
  )
}

export default Page
