'use client'

import { UserRoundCog, ChevronDown, Pencil } from 'lucide-react'
import { useState } from 'react'
import { generateRandomColor } from '@/components/ui/generatorRandomColors'
import ModalProfil from '@/components/atoms/modal/modalProfil'
import { useAuth } from '@/context/AuthContext'
import * as React from 'react'
import Sirene from '@/components/atoms/siret/sirene'

const ensureHttps = (url: string) => {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

const Page = () => {
  const { user } = useAuth()

  const [imageLink, setImageLink] = useState<string>('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: '',
    inputs: [{ label: '', type: '' }],
  })

  const handleImageError = () => {
    console.error('Failed to load image')
    setImageError(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleProfil = (
    title: string,
    description: string,
    inputs: Array<{ label: string; type: string }>,
  ) => {
    setModalConfig({ title, description, inputs })
    setIsModalOpen(true)
  }

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
      : ''
  }

  const name = user && user.email.split('@')[0]

  const imageDe = user && user.email.split('@')[0]

  return (
    <section className="flex-1 max-w-full relative bg-[#f6f7fd]">
      <div className="container py-8 px-10 max-w-full mx-auto w-full">
        <div data-v-5fc5e367="" className="pb-[4rem]">
          <div className="w-full mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <UserRoundCog />
                  <div className="font-semibold" style={{ fontSize: '24px' }}>
                    Profil
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex gap-4">
                      <button
                        onClick={() => openModal()}
                        type="button"
                        className="bg-[#493fff] px-2.5 rounded-md py-1.5 h-[36px] items-center justify-center relative"
                      >
                        <span className="font-semibold flex items-center gap-1 text-white">
                          Recuperer vos données via notre numero sirene
                        </span>
                      </button>
                      <button
                        type="button"
                        className="bg-white px-2.5 rounded-md py-1.5 items-center justify-center h-[36px]"
                      >
                        <span className="font-semibold flex items-center gap-1">
                          En savoir plus
                          <ChevronDown className="h-5 w-5" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white mt-8 rounded-lg  border-solid text-[#25385e] border-1 border-[#e7e7f3]">
                <div className="mb-[1.75rem] p-[1.25rem]">
                  <div className="text-center w-full mx-auto">
                    <div
                      className="cursor-pointer mb-4"
                      onClick={() =>
                        handleProfil(
                          'Changer de photo',
                          'Éditez votre photo de profil',
                          [{ label: 'Sélectionnez une image', type: 'file' }],
                        )
                      }
                    >
                      <figure className="c-avatar">
                        {(imagePreviewUrl || imageLink || imageDe) &&
                        !imageError ? (
                          <img
                            src={ensureHttps(
                              imagePreviewUrl ||
                                imageLink ||
                                '@/../public/images/moi.jpeg' ||
                                'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            )}
                            alt="Profile"
                            onError={handleImageError}
                          />
                        ) : (
                          <div
                            className=" rounded-md h-28 w-28 flex items-center justify-center mx-auto"
                            style={{ backgroundColor: generateRandomColor() }}
                          >
                            <span className="text-[#0B2B23] font-medium text-2xl">
                              {getInitials(name)}
                            </span>
                          </div>
                        )}
                      </figure>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[1rem] font-[700]">{name}</span>
                      <button
                        className="flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
                        onClick={() =>
                          handleProfil(
                            'Nom complet',
                            'Éditez les informations de votre profil',
                            [
                              { label: 'Prénom', type: 'prenom' },
                              { label: 'Nom', type: 'nom' },
                            ],
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f8f9fd] ">
                  <div className="p-[1.25rem] text-[1.125rem] font-[700] mt-[-0.25rem] as-highlighted-title">
                    À propos de vous
                  </div>
                </div>
                <div>
                  <div className=" p-[1.25rem]">
                    <div className="">
                      <table className="w-full">
                        <tbody className="w-full">
                          <tr className="flex justify-between w-full border-solid border-b border-b-[#e7e7f3]">
                            <td className="flex flex-col gap-1 w-full pr-0 pb-[1rem] pt-[1rem]">
                              <div className="text-[1rem] font-semibold">
                                Numéro de téléphone
                              </div>
                              <div className="text-[#5a7294]">
                                +33 6 66 34 03 51
                              </div>
                            </td>
                            <td className="flex items-center justify-end  text-right pr-0 pb-[1rem] pl-[1rem] pt-[1rem]">
                              <button
                                type="button"
                                className="h-[36px] min-w-[64px] px-[16px] text-[#0075eb] text-[0.875rem] border border-solid font-[700] rounded-md hover:bg-blue-100"
                                onClick={() =>
                                  handleProfil(
                                    'Numéro de téléphone',
                                    'Éditez les informations concernant votre numéro de téléphone',
                                    [
                                      {
                                        label: 'Téléphone (recommandé)',
                                        type: 'number',
                                      },
                                    ],
                                  )
                                }
                              >
                                <span>Modifier</span>
                              </button>
                            </td>
                          </tr>
                          <tr className="flex justify-between w-full border-solid border-b border-b-[#e7e7f3]">
                            <td className="flex flex-col gap-1 w-full pr-0 pb-[1rem] pt-[1rem]">
                              <div className="text-[1rem] font-semibold">
                                Civilité
                              </div>
                              <div className="text-[#5a7294]">
                                Non renseigné
                              </div>
                            </td>
                            <td className="flex items-center justify-end  text-right pr-0 pb-[1rem] pl-[1rem] pt-[1rem]">
                              <button
                                type="button"
                                className="h-[36px] min-w-[64px] px-[16px] text-[#0075eb] text-[0.875rem] border border-solid font-[700] rounded-md hover:bg-blue-100"
                                onClick={() =>
                                  handleProfil(
                                    'Civilité',
                                    'Éditez les informations concernant votre civilité',
                                    [{ label: 'Civilité', type: 'select' }],
                                  )
                                }
                              >
                                <span>Modifier</span>
                              </button>
                            </td>
                          </tr>
                          <tr className="flex justify-between w-full">
                            <td className="flex flex-col gap-1 w-full pr-0 pb-[1rem] pt-[1rem]">
                              <div className="text-[1rem] font-semibold">
                                Date de naissance
                              </div>
                              <div className="text-[#5a7294]">
                                Non renseigné
                              </div>
                            </td>
                            <td className="flex items-center justify-end pr-0 pb-[1rem] pl-[1rem] pt-[1rem]">
                              <button
                                type="button"
                                className="h-[36px] min-w-[64px] px-[16px] text-[#0075eb] text-[0.875rem] border-solid  border font-[700] rounded-md hover:bg-blue-100 w-full right"
                                onClick={() =>
                                  handleProfil(
                                    'Date de naissance',
                                    'Éditez votre date de naissance',
                                    [
                                      {
                                        label: 'Date de naissance *',
                                        type: 'date',
                                      },
                                    ],
                                  )
                                }
                              >
                                <span>Modifier</span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalProfil
        setOpenModalProfil={setIsModalOpen}
        openModalProfil={isModalOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        inputs={modalConfig.inputs}
      />

      <Sirene isOpen={isOpen} setIsOpen={setIsOpen} closeModal={closeModal} />
    </section>
  )
}

export default Page
