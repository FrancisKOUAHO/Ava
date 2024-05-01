// @ts-nocheck

import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCustomer, updateCustomer } from '@/lib/customer'
import { Client } from '@/types/Client'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Client | null
  onAddClient: (client: Client, isUpdating: boolean) => void
  isUpdating: boolean
}

function CustomerModal({
  isOpen,
  onClose,
  initialData,
  onAddClient,
  isUpdating,
}: CustomerModalProps) {
  const [client, setClient] = useState<Client>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    company: '',
    vat_number: '',
    currency: '',
    language: '',
  })
  const [resetKey, setResetKey] = useState<number>(0)

  useEffect(() => {
    if (initialData) {
      setClient({ ...initialData })
    } else {
      setClient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        company: '',
        vat_number: '',
        currency: '',
        language: '',
      })
    }
  }, [initialData, resetKey])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setClient((prev) => ({ ...prev, [name as keyof Client]: value }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const customer = isUpdating
        ? await updateCustomer(client)
        : await createCustomer(client)
      onAddClient(customer, isUpdating)
      handleReset()
    } catch (error) {}
  }

  const handleReset = () => {
    setResetKey((prevKey) => prevKey + 1)
    onClose()
  }

  const handleCloseModal = () => {
    //resetClientState();
    onClose()
  }
  return (
    <Transition appear show={isOpen} as={Fragment} key={resetKey}>
      <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Ajouter un nouveau client
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-2">
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[
                      { label: 'Prénom', name: 'first_name' },
                      { label: 'Nom', name: 'last_name' },
                      { label: 'Email', name: 'email', type: 'email' },
                      { label: 'Téléphone', name: 'phone' },
                      { label: 'Adresse', name: 'address' },
                      { label: 'Ville', name: 'city' },
                      { label: 'État/Région', name: 'state' },
                      { label: 'Code Postal', name: 'zip' },
                      { label: 'Pays', name: 'country' },
                      { label: 'Société', name: 'company' },
                      { label: 'Numéro de TVA', name: 'vat_number' },
                      { label: 'Devise', name: 'currency' },
                      { label: 'Langue', name: 'language' },
                    ].map(({ label, name, type = 'text' }, index) => (
                      <div
                        key={name}
                        className={index % 2 === 0 ? 'pr-2' : 'pl-2'}
                      >
                        <Label htmlFor={name}>{label}</Label>
                        <Input
                          id={name}
                          type={type}
                          name={name}
                          value={client[name]}
                          onChange={handleChange}
                          placeholder={label}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit">Appliquer modification</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CustomerModal
