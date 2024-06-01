'use client'

import { FileText, Settings, ChevronDown, CloudDownload, Plus, Check } from 'lucide-react';
import {Tab} from '@headlessui/react'

const Page = () => {
    return (
        /*      <section className="px-10 py-8">
                  <div className="flex text-black">
                      zola azz
                  </div>
              </section>*/
        <section className="flex-1 max-w-full relative bg-[#f6f7fd]">
            <div className="container py-8 px-10 max-w-full mx-auto w-full">
                <div data-v-5fc5e367="" className="pb-[4rem]">
                    <div className="w-full mx-auto">
                        <div className="mb-6">
                                <div className="flex justify-between items-center flex-wrap">
                                    <div className="flex gap-2 items-center">
                                        <FileText />
                                        <div className="font-semibold" style={{fontSize: "24px"}}>
                                            Documents
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 flex-wrap">
                                            <div data-v-5fc5e367="">
                                                <button type="button" className="bg-white px-2.5 rounded-md py-1.5 h-[36px] items-center justify-center relative">
                                                    <Settings />
                                                </button>
                                            </div>
                                            <div>
                                                <button type="button" className="bg-white px-2.5 rounded-md py-1.5 items-center justify-center h-[36px]">
                                                    <span className="font-semibold flex items-center gap-1">
                                                        En savoir plus
                                                        <ChevronDown className="h-5 w-5" />
                                                    </span>
                                                </button>
                                            </div>
                                            <div>
                                                <button type="button" className="bg-white px-2.5 rounded-md py-1.5 h-[36px] items-center justify-center relative">
                                                    <CloudDownload />
                                                </button>
                                            </div>
                                            <div>
                                                <button type="button" className="bg-[#0075eb] px-2.5 rounded-md py-1.5 h-[36px] items-center justify-center relative">
                                                    <span className="items-center font-semibold flex gap-1 text-white">
                                                        <Plus/>
                                                        Nouvelle facture
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Tab.Group>
                                        <div className="flex border-solid border-b-[0.5px] border-[#e7e7f3]">
                                            <Tab.List className="flex font-[600] gap-4 text-[#5a7294]">
                                                <Tab className={({ selected }) => selected ? "text-[#0075eb] border-solid border-b-3 border-b-[#0075eb] border-transparent cursor-pointer px-1.5 py-1.5" : "c-each-list"}>
                                                    <h4>
                                                        Factures
                                                    </h4>
                                                </Tab>
                                                <Tab disabled className={({ selected }) => selected ? "text-[#0075eb] border-solid border-b-3 border-b-[#0075eb] border-transparent cursor-pointer px-1.5 py-1.5" : "c-each-list c-disabled-tab"}>
                                                    <h4>
                                                        Devis
                                                    </h4>
                                                </Tab>
                                                <Tab disabled className={({ selected }) => selected ? "text-[#0075eb] border-solid border-b-3 border-b-[#0075eb] border-transparent cursor-pointer px-1.5 py-1.5" : "c-each-list c-disabled-tab"}>
                                                    <h4>
                                                        Avoirs
                                                    </h4>
                                                </Tab>
                                                <Tab disabled className={({ selected }) => selected ? "text-[#0075eb] border-solid border-b-3 border-b-[#0075eb] border-transparent cursor-pointer px-1.5 py-1.5" : "c-each-list c-disabled-tab"}>
                                                    <h4>
                                                        Bons de commande
                                                    </h4>
                                                </Tab>
                                            </Tab.List>
                                        </div>
                                        <Tab.Panels>
                                            <Tab.Panel>
                                                <div className="flex flex-wrap mt-12">
                                                    <div className="flex gap-[1.25rem] w-full max-w-[1000px]">
                                                        <div className="w-full md:max-w-[400px] md:min-w-[400px] md:flex-1">
                                                            <div className="text-[1.5rem] font-[900] leading-8 mb-[0.75rem] text-[#25385E]">
                                                                Facturez facilement en toute conformité
                                                            </div>
                                                            <div className="text-[16px] mb-[1.5rem] relative">
                                                                <p className="mb-5">
                                                                Facturez et gérez vos clients en quelques clics et assurez vous d'être payé
                                                                dans les temps
                                                                </p>
                                                                <ul className="">
                                                                    <li className="font-[500] flex items-center gap-2">
                                                                        <Check className="text-[#0075eb]"/>
                                                                        Factures en quelques clics
                                                                    </li>
                                                                    <li className="font-[500] flex items-center gap-2 mt-2">
                                                                        <Check className="text-[#0075eb]"/>
                                                                        Relances automatiques en cas d'impayés
                                                                    </li>
                                                                    <li className="font-[500] flex items-center gap-2 mt-2">
                                                                        <Check className="text-[#0075eb]"/>
                                                                        Lien de paiement en ligne par carte bancaire
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="flex gap-2 flex-wrap items-center">
                                                                <button type="button" className="bg-[#0075eb] px-2.5 rounded-md py-1.5 h-[36px] items-center justify-center relative">
                                                                    <span className="items-center font-semibold flex gap-1 text-white">
                                                                        Créer une facture
                                                                    </span>
                                                                </button>
                                                                <button type="button" className="items-center justify-center">
                                                                    <span
                                                                    className="font-semibold text-[#0075eb]">
                                                                    Configurer mes documents
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-auto inline-flex items-center justify-center mt-8 md:mt-0">
                                                            <img src="/images/first-invoice.png" style={{width: "100%", maxWidth: "500px"}} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                Bonjour
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                Con
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                RAT
                                            </Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </section>
)
}

export default Page