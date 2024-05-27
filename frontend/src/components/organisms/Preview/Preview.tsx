'use client'

import React, { useRef, forwardRef } from 'react'
import { FileText, ImagePlus } from 'lucide-react'
import { useSirene } from '@/app/hooks/useSirene'
import { CustomerProps } from '@/types/CustomerProps'
import { LineItem } from '@/types/LineItemProps'
import { SubTotal } from '@/types/SubTotalProps'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PreviewProps {
  customer: CustomerProps | null
  lineItems: LineItem[] | null
  subTotal: SubTotal | null
  imagePreviewUrl: string | null
  ref: React.RefObject<HTMLDivElement>
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ customer, lineItems, subTotal, imagePreviewUrl, ref }) => {
    const { data: compagny } = useSirene()

    if (!compagny || !customer || !subTotal) return null

    const pdfRef = useRef<HTMLDivElement>(null)

    const downloadPDF = async (isDownloading = false) => {
      let pdfBlob

      try {
        const input = pdfRef.current
        if (!input) return
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          width: input.scrollWidth,
          height: input.scrollHeight,
        })

        const imgData = canvas.toDataURL('image/png')
        const imgProps = pdf.getImageProperties(imgData)
        const imgWidth = pageWidth
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width

        let heightLeft = imgHeight
        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        if (isDownloading) {
          pdf.save('download.pdf')
        }
        pdfBlob = pdf.output('blob')
      } catch (error) {
        console.error('Error generating PDF: ', error)
      }
      return pdfBlob
    }

    return (
      <div className="w-3/4 px-2 rounded-xl">
        <div className="flex justify-between">
          <h3 className="text-black text-lg font-semibold">Preview</h3>
          <div className="flex justify-center items-center gap-2">
            <button onClick={() => downloadPDF()}>
              <FileText className="text-black hover:text-blue-700 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-[#f2f5fd] rounded-xl my-2 p-2" ref={pdfRef}>
          <div className="bg-white px-6 py-2 rounded-xl">
            <div className="flex justify-center p-4">
              <div className="flex w-1/3">
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
              <div className="w-full">
                <div className="flex flex-col w-full mb-6">
                  <div>
                    <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                      <tbody>
                        <tr>
                          <td className="flex items-center gap-2 p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">Company</p>
                              <p className="text-sm text-black/70">
                                {compagny[0]?.companyName}
                              </p>
                            </div>
                          </td>
                          <td className="p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">Address</p>
                              <p className="text-sm text-black/70">
                                1234 Main Street
                              </p>
                            </div>
                          </td>
                          <td className="flex items-center gap-2 p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">City</p>
                              <p className="text-sm text-black/70">New York</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="flex items-center gap-2 p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">Country</p>
                              <p className="text-sm text-black/70">
                                United States
                              </p>
                            </div>
                          </td>
                          <td className="p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">ZIP Code</p>
                              <p className="text-sm text-black/70">12345</p>
                            </div>
                          </td>
                          <td className="p-1 text-center">
                            <div className="w-full">
                              <p className="text-black text-sm">Phone</p>
                              <p className="text-sm text-black/70">
                                +1 123 456 7890
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-700 rounded-sm p-2 text-white mb-2">
              <div className="flex justify-between">
                <p>Billed To</p>
                <div className="flex justify-center items-center gap-2">
                  <p>Total à régler</p>
                  <p>{subTotal && subTotal.total} €</p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex flex-col w-full mb-6">
                <div>
                  <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                    <tbody>
                      <tr>
                        <td className="flex items-center gap-2 p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">Client</p>
                            <p className="text-sm text-black/70">
                              {customer.company}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">Address</p>
                            <p className="text-sm text-black/70">
                              {customer.address}
                            </p>
                          </div>
                        </td>
                        <td className="flex items-center gap-2 p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">City</p>
                            <p className="text-sm text-black/70">
                              {customer.city}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-center gap-2 p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">Country</p>
                            <p className="text-sm text-black/70">
                              {customer.country}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">ZIP Code</p>
                            <p className="text-sm text-black/70">
                              {customer.zip}
                            </p>
                          </div>
                        </td>
                        <td className="p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm"> Numero SIREN</p>
                            <p className="text-sm text-black/70">
                              {customer.sirenNumber}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-xl my-6 w-full">
              <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                <thead className="border-b-2 border-gray-300 mb-4">
                  <tr>
                    <th className="flex items-center gap-2 p-3 text-center">
                      Item
                    </th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">Rate</th>
                    <th className="p-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems &&
                    lineItems.map((lineItem: LineItem, index: number) => (
                      <tr key={index} className="bg-[#e7effc] rounded-lg">
                        <td className="flex items-center gap-2 p-3 text-center">
                          {lineItem.name}
                        </td>
                        <td className="p-3 text-center">{lineItem.quantity}</td>
                        <td className="p-3 text-center">{lineItem.tva}</td>
                        <td className="p-3 text-center">
                          {lineItem.lineTotal}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col w-full mb-6">
              <div className="flex justify-start items-center w-full gap-3 mb-2">
                <p className="text-sm">Appliquer une réduction</p>
                <hr className="w-full text-blue-700" />
              </div>
              <div>
                <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                  <tbody>
                    <tr className="bg-[#e7effc] rounded-xl">
                      <td className="flex items-center gap-2 p-3 text-center">
                        Discount
                      </td>
                      <td className="p-3 text-center">€100</td>
                      <td className="p-3 text-center">€100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col w-full mb-6">
              <div className="flex justify-start items-center w-full gap-3 mb-2">
                <p className="text-sm">Total</p>
                <hr className="w-full text-blue-700" />
              </div>
              <div>
                <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                  <tbody>
                    <tr className="bg-[#e7effc] rounded-xl">
                      <td className="flex items-center gap-2 p-3 text-center">
                        Discount
                      </td>
                      <td className="p-3 text-center">€100</td>
                      <td className="p-3 text-center">€100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col w-full mb-6">
              <div>
                <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                  <tbody>
                    <tr>
                      <td className="font-black text-black">
                        <h5>Total à régler</h5>
                      </td>
                      <td className="p-3 text-center font-black text-black">
                        {subTotal && subTotal.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full my-">
              <div className="flex justify-between items-center w-full gap-3 mb-2">
                <p className=" font-black text-sm">Notes</p>
              </div>
              <div className="grid w-full items-center gap-1.5 my-2">
                <p className="font-normal text-sm">
                  Les factures devront être réglées en Euros (€) dès réception,
                  et au plus tard dans un délai de X jours (délai inférieur ou
                  égal à 45 jours fin de mois ou 60 jours) à partir de la date
                  de leur émission
                </p>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center w-full gap-3 mb-2">
                <p className=" font-black text-sm">Terms</p>
              </div>
              <div className="grid w-full items-center gap-1.5 my-2">
                <p className="font-normal text-sm">
                  Les factures devront être réglées en Euros (€) dès réception,
                  et au plus tard dans un délai de X jours (délai inférieur ou
                  égal à 45 jours fin de mois ou 60 jours) à partir de la date
                  de leur émission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default Preview
