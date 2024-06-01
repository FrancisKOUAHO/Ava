'use effect'

import { Fragment, FunctionComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import CreateInvoice from '@/components/molecules/forms/invoice/create-invoice'

interface InvoiceProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

const Invoice: FunctionComponent<InvoiceProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                <div className="relative w-full h-full max-w-none bg-[#f8fafe] shadow-xl">
                  <div className="flex items-center justify-between p-4 border-b">
                    {/* <h2 className="text-xl font-semibold">Archive :
                      <span
                        className="inline-flex items-center rounded-xl bg-[#DFFFA5] px-2 py-1 text-base font-bold text-[#0b2b23] ring-1 ring-inset ring-gray-600/20 ml-2">
                                          {query}</span>
                    </h2>*/}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: 'calc(100vh - 64px)' }}
                  >
                    <CreateInvoice />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Invoice
