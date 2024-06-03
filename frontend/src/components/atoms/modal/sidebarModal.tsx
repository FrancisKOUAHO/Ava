'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CircleX, BarChartBig, FileBarChart2, Users, LayoutDashboard, Calculator } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SidebarModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void }) => {
    const pathname = usePathname()

    const [showInvoiceMenu, setShowInvoiceMenu] = React.useState(false)
    const [showDevisMenu, setShowDevisMenu] = React.useState(false)

    const toggleInvoiceMenu = () => setShowInvoiceMenu(!showInvoiceMenu)
    const toggleDevisMenu = () => setShowDevisMenu(!showDevisMenu)

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 w-[230px]" onClose={closeModal}>
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

                <div className="fixed inset-0 flex justify-center items-center w-[230px]">
                    <div className="absolute inset-0 overflow-hidden bg-[#493fff]">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex ">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto">
                                    <div className="flex h-full flex-col bg-[#493fff] shadow-xl overflow-y-auto  w-[230px]">
                                        <Dialog.Title
                                            as="h3"
                                            className="font-[900] text-[2rem] leading-8 mb-2"
                                        >
                                            <div className="logo">
                                                <img src="/logo/logo_blanc.png" alt="logo skipperndt" />
                                            </div>
                                        </Dialog.Title>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default SidebarModal
