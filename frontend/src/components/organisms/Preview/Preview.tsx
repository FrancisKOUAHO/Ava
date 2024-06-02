'use client'

import React, { useRef, forwardRef } from 'react'
import { FileText, ImagePlus } from 'lucide-react'
import { useSirene } from '@/app/hooks/useSirene'
import { CustomerProps } from '@/types/CustomerProps'
import { LineItem } from '@/types/LineItemProps'
import { SubTotal } from '@/types/SubTotalProps'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { downloadPDF } from '@/lib/download-pdf'

interface PreviewProps {
  customer: CustomerProps | null
  lineItems: LineItem[] | null
  subTotal: SubTotal | null
  imagePreviewUrl: string | null
  terms: string | null
  notes: string | null
  getTotalInvoices: () => number
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({
    customer,
    lineItems,
    subTotal,
    imagePreviewUrl,
    terms,
    notes,
    getTotalInvoices,
  }) => {
    const { data: compagny } = useSirene()

    console.log('compagny', compagny)

    if (!compagny || !customer || !subTotal) return null

    const pdfRef = useRef<HTMLDivElement>(null)

    return (
      <div className="px-2 rounded-xl">
        <div
          className="my-2"
          style={{
            position: 'sticky',
            top: 'calc(0rem)',
            maxWidth: ' 550px',
          }}
        >
          <div className="bg-white px-5 my-2 py-2 rounded-xl" ref={pdfRef}>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div>
                  <h1 className="text-xl font-bold text-[#493fff]">Facture</h1>
                  <p className="text-xs text-black/70">
                    N° F-2024-001
                    <span className="bg-[#493fff] text-white text-xs font-medium me-2 py-1 px-3  rounded ml-10">
                      Brouillon
                    </span>
                  </p>
                </div>

                <div className="my-3">
                  <h6 className="text-sm font-bold text-black uppercase">
                    Monsieur {compagny[0].lastName} {compagny[0].firstName}
                  </h6>
                  <p className="text-xs text-black/70 ">
                    {compagny[0].company}
                  </p>
                  <p className="text-xs text-black/70">{compagny[0].email}</p>
                  <p className="text-xs text-black/70">{compagny[0].phone}</p>
                  <p className="text-xs text-black/70 uppercase">
                    {compagny[0].address}
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    {compagny[0].zip} {compagny[0].city}
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    N° siret: {compagny[0].sirenNumber}
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    N° TVA: {compagny[0].tvaNumber}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-black/70 ">
                    Date d'emission: <span>31/05/2024</span>
                  </p>
                  <p className="text-xs text-black/70 ">
                    Date d'exigibilité: <span>30/06/2024</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-12">
                <div className="my-3">
                  <p className="text-xs text-black/70 ">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    {customer.address}
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    {customer.zip} {customer.city}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-18 h-18"
                  />
                ) : (
                  <ImagePlus className="text-blue-700 w-10 h-10" />
                )}
              </div>
            </div>

            <div className="rounded-xl my-2 w-full">
              <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                <thead className="border-b-2 border-gray-300 mb-4 text-black">
                  <tr className="bg-[#493fff] rounded-xl text-white">
                    <th className="text-center text-xs p-2">#</th>
                    <th className="text-center text-xs">
                      Désgination et description
                    </th>
                    <th className="text-center text-xs">Unité</th>
                    <th className="text-center text-xs">Quantité</th>
                    <th className="text-center text-xs">Montant HT</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems &&
                    lineItems.map((lineItem: LineItem, index: number) => (
                      <tr key={index}>
                        <td className="text-black p-3 text-center text-xs">
                          {index + 1}
                        </td>
                        <td className="text-black p-3 text-center text-xs">
                          {lineItem.name}
                        </td>
                        <td className="text-black p-3 text-center text-xs">
                          {lineItem.unit}
                        </td>
                        <td className="text-black p-3 text-center text-xs">
                          {lineItem.quantity}
                        </td>
                        <td className="text-black p-3 text-center text-xs">
                          {lineItem.lineTotal} €
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between space-y-0.5 mt-16">
              <div className="w-full font-normal text-[11px]">
                <div className="my-1">
                  <p className="font-normal text-[11px]">Délai de paiement</p>
                  <span className="font-normal text-[11px]">30 jours</span>
                </div>

                <div className="my-1">
                  <p className="font-normal text-[11px]">Pénalités de retard</p>
                  <span className="font-normal text-[11px]">
                    3 fois le taux légal
                  </span>
                </div>

                <div className="my-1">
                  <p className="font-normal text-[11px]">Escompte</p>
                  <span className="font-normal text-[11px]">Aucun</span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="w-[300px] bg-[#e7effc] text-black gap-4 text-sm p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">Total HT</p>
                    </div>
                    <div className="text-sm">
                      {subTotal && subTotal.total} €
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">Remise générale</p>
                    </div>
                    <div className="text-sm">
                      {subTotal && subTotal.discount} €
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p className="text-sm">Total HT final</p>
                    </div>
                    <div className="text-sm">
                      {getTotalInvoices().toFixed(2)} €
                    </div>
                  </div>
                </div>

                <p className="mt-1 text-gray-500 text-[10px]">
                  TVA non applicable, art 293 B du CGI
                </p>
              </div>
            </div>

            <div className="w-full gap-1.5 my-4">
              <h6 className="mb-2 font-black text-black">
                Réleve d'identité Bancaire
              </h6>
              <p className="font-normal text-[12px]">
                Banque:
                <span className="uppercase"> Societe general</span>
              </p>

              <p className="font-normal text-[12px]">
                IBAN:
                <span className="uppercase"> Societe general</span>
              </p>

              <p className="font-normal text-[12px]">
                BIC:
                <span className="uppercase"> Societe general</span>
              </p>
            </div>

            <div className="grid w-full items-center gap-1.5 my-2">
              <p className="font-normal text-[9px]">{terms}</p>
            </div>

            <div className="grid w-full items-center gap-1.5 mt-2 mb-6">
              <p className="font-normal text-[9px]">{notes}</p>
            </div>

            <div className="flex justify-center items-center">
              <img
                src="/logo/icon-logo.png"
                alt="logo"
                width={40}
                height={40}
              />
              <p>
                <span className="text-xs">Plumera</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default Preview
