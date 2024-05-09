'use client'

import { useState } from 'react'
import { FileText, ImagePlus, Printer, Scan } from 'lucide-react'

interface LineItem {
  item: string
  rate: number
  qty: number
  lineTotal: number
}

const Preview = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      item: 'Design',
      rate: 100,
      qty: 1,
      lineTotal: 100,
    },
    {
      item: 'Development',
      rate: 200,
      qty: 1,
      lineTotal: 200,
    },
    {
      item: 'Marketing',
      rate: 300,
      qty: 1,
      lineTotal: 300,
    },
  ])

  return (
    <div className="w-2/4 bg-white px-6 py-6 rounded-xl">
      <div className="flex justify-between">
        <h3 className="text-black text-lg font-semibold">Preview</h3>
        <div className="flex justify-center items-center gap-2">
          <button>
            <Scan className="text-black hover:text-blue-700 w-5 h-5" />
          </button>
          <button>
            <FileText className="text-black hover:text-blue-700 w-5 h-5" />
          </button>
          <button>
            <Printer className="text-black hover:text-blue-700 w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#f2f5fd] rounded-xl my-8 p-2 h-[70vh] overflow-auto">
        <div className="bg-white px-6 py-2 rounded-xl">
          <div className="flex justify-center p-4">
            <div className="flex w-1/3">
              <ImagePlus className="text-blue-700 w-10 h-10" />
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
                            <p className="text-sm text-black/70">LetsGo</p>
                          </div>
                        </td>
                        <td className="p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">Address</p>
                            <p className="text-sm text-black/70">
                              1234 Main Street, Suite 123
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex items-center gap-2 p-1 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">City</p>
                            <p className="text-sm text-black/70">New York</p>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="w-full">
                            <p className="text-black text-sm">Address n°2</p>
                            <p className="text-sm text-black/70">
                              1234 Main Street, Suite 123
                            </p>
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

          <div className="bg-blue-700 rounded-sm p-2 text-white">
            <div className="flex justify-between">
              <p>Billed To</p>
              <div className="flex justify-center items-center gap-2">
                <p>Amount Due</p>
                <p>$ 1,234.00</p>
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
                            Francis KOUAHO
                          </p>
                        </div>
                      </td>
                      <td className="p-1 text-center">
                        <div className="w-full">
                          <p className="text-black text-sm">Address</p>
                          <p className="text-sm text-black/70">
                            1234 Main Street, Suite 123
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
                      <td className="p-3 text-center">
                        <div className="w-full">
                          <p className="text-black text-sm">Address n°2</p>
                          <p className="text-sm text-black/70">
                            1234 Main Street, Suite 123
                          </p>
                        </div>
                      </td>
                      <td className="flex items-center gap-2 p-1 text-center">
                        <div className="w-full">
                          <p className="text-black text-sm">Country</p>
                          <p className="text-sm text-black/70">United States</p>
                        </div>
                      </td>
                      <td className="p-1 text-center">
                        <div className="w-full">
                          <p className="text-black text-sm">ZIP Code</p>
                          <p className="text-sm text-black/70">12345</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
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

          <div className="rounded-xl my-6 w-full">
            <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
              <thead className="border-b-2 border-gray-300 mb-4">
                <tr>
                  <th className="flex items-center gap-2 p-3 text-center">
                    Item
                  </th>
                  <th className="p-3 text-center">Rate</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems &&
                  lineItems.map((lineItem: LineItem, index: number) => (
                    <tr key={index} className="bg-[#e7effc] rounded-lg">
                      <td className="flex items-center gap-2 p-3 text-center">
                        {lineItem.item}
                      </td>
                      <td className="p-3 text-center">{lineItem.rate}</td>
                      <td className="p-3 text-center">{lineItem.qty}</td>
                      <td className="p-3 text-center">{lineItem.lineTotal}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col w-full mb-6">
            <div className="flex justify-start items-center w-full gap-3 mb-2">
              <p className="text-sm">Subtotal</p>
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
                      <h5>Amount Due</h5>
                    </td>
                    <td className="p-3 text-center font-black text-black">
                      €100
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
                Les factures devront être réglées en Euros (€) dès réception, et
                au plus tard dans un délai de X jours (délai inférieur ou égal à
                45 jours fin de mois ou 60 jours) à partir de la date de leur
                émission
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center w-full gap-3 mb-2">
              <p className=" font-black text-sm">Terms</p>
            </div>
            <div className="grid w-full items-center gap-1.5 my-2">
              <p className="font-normal text-sm">
                Les factures devront être réglées en Euros (€) dès réception, et
                au plus tard dans un délai de X jours (délai inférieur ou égal à
                45 jours fin de mois ou 60 jours) à partir de la date de leur
                émission
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview
