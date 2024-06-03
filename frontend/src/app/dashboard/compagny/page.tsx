'use client'

import React from 'react'
import { useSirene } from '@/app/hooks/useSirene'

const Page = () => {
  const { data } = useSirene()

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <section className="py-1 bg-blueGray-50 text-black">
      <div className="w-full px-4 mx-auto mt-6">
        <div className="relative flex flex-col break-words w-full mb-6 rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                Mon entreprise
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Les informations de mon entreprise
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Nom de mon entreprise (nom commercial)
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data[0]?.companyName}
                      placeholder={data[0]?.companyName}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Adresse
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Statut juridique
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Code Postal
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Forme juridique
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Numéro SIRET
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data[0]?.sirenNumber}
                      placeholder={data[0]?.sirenNumber}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Numéro de TVA intracommunautaire
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data[0]?.tvaNumber}
                      placeholder={data[0]?.sirenNumber}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Structure juridique
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data[0]?.legalStructure}
                      placeholder={data[0]?.legalStructure}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Statut juridique
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data[0]?.legalStatus}
                      placeholder={data[0]?.legalStatus}
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Taxes
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      TVA
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={data?.company_name}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
