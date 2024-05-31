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

      console.log('Downloading PDF')

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
      <div className="w-2/4 px-2 rounded-xl">
        <div className="flex justify-between">
          <h3 className="text-black text-lg font-semibold">Preview</h3>
          <div className="flex justify-center items-center gap-2">
            <button onClick={() => downloadPDF(true)}>
              <FileText className="text-black hover:text-blue-700 w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="my-2" ref={pdfRef}>
          <div className="bg-white px-5 py-2 rounded-xl">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div>
                  <h1 className="text-xl font-bold text-[#493fff]">Facture</h1>
                  <p className="text-xs text-black/70">
                    N° F-2024-001
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ml-10">
                      Brouillon
                    </span>
                  </p>
                </div>

                <div className="my-3">
                  <h6 className="text-sm font-bold text-black uppercase">
                    Monsieur Francis KOUAHO
                  </h6>
                  <p className="text-xs text-black/70 ">Francis KOUAHO</p>
                  <p className="text-xs text-black/70">
                    kouahofrancis@gmail.com
                  </p>
                  <p className="text-xs text-black/70">+33600000000</p>
                  <p className="text-xs text-black/70 uppercase">
                    119 rue saint sebastien
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    78300 Poissy
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    N° siret: 123456789
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    N° TVA: FR123456789
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
                  <p className="text-xs text-black/70 ">Francis KOUAHO</p>
                  <p className="text-xs text-black/70 uppercase">
                    119 rue saint sebastien
                  </p>
                  <p className="text-xs text-black/70 uppercase">
                    78300 Poissy
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
                    <th className="text-center">#</th>
                    <th className="text-center">Désgination et description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-center">Rate</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems &&
                    lineItems.map((lineItem: LineItem, index: number) => (
                      <tr key={index}>
                        <td className="text-black p-3 text-center">{index}</td>
                        <td className="text-black p-3 text-center">
                          {lineItem.name}
                        </td>
                        <td className="text-black p-3 text-center">
                          {lineItem.quantity}
                        </td>
                        <td className="text-black p-3 text-center">
                          {lineItem.tva}
                        </td>
                        <td className="text-black p-3 text-center">
                          {lineItem.lineTotal}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="w-full flex flex-col my-8">
              <div className="flex justify-start items-center w-full gap-3 mb-2">
                <p className="text-sm">Appliquer une réduction</p>
                <hr className="w-full text-blue-700" />
              </div>
              <div>
                <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                  <tbody>
                    <tr className="bg-[#493fff] rounded-xl text-white">
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
                    <tr className="bg-[#493fff] rounded-xl text-white">
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

            <div className="flex justify-between space-y-0.5">
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
                <div className="w-[300px] bg-[#e7effc] text-black gap-4 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p>Total HT</p>
                    </div>
                    <div className="text-sm">
                      {subTotal && subTotal.total} €
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <h5>Remise générale</h5>
                    </div>
                    <div className="text-sm">
                      {subTotal && subTotal.total} €
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <h5>Total HT final</h5>
                    </div>
                    <div className="text-sm">
                      {subTotal && subTotal.total} €
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
              <p className="font-normal text-[9px]">
                Les factures devront être réglées en Euros (€) dès réception, et
                au plus tard dans un délai de X jours (délai inférieur ou égal à
                45 jours fin de mois ou 60 jours) à partir de la date de leur
                émission
              </p>
            </div>

            <div className="grid w-full items-center gap-1.5 my-2">
              <p className="font-normal text-[9px]">
                Les factures devront être réglées en Euros (€) dès réception, et
                au plus tard dans un délai de X jours (délai inférieur ou égal à
                45 jours fin de mois ou 60 jours) à partir de la date de leur
                émission
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default Preview
