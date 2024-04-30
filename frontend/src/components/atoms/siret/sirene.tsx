'use client'
// @ts-nocheck

import { Ellipsis, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect, FormEvent } from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios';  // Assuming you're using Axios
import fetchSirenDetails from "@/app/services/customer";
import {Client} from "@/app/models/Client";



const Sirene = () => {
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const scrappSirenMutation = useMutation<Client, AxiosError, Client>(fetchSirenDetails, {
    onError: (error: AxiosError) => {
      toast.error(`Error: ${error.message}`, {
        position: 'top-right',
        duration: 5000
      });
    },
    onSuccess: (data: Client) => {
      console.log('Fetched SIREN data:', data);
      queryClient.invalidateQueries(['tax_information']);
      toast.success('SIREN data updated successfully', {
        position: 'top-right',
        duration: 5000
      });
    },
  });

  const handleCreateClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const siren_number = formData.get('siren_number') as string;  // Assuming the input name is 'siren_number'
    await scrappSirenMutation.mutateAsync({ siren_number });
    setLoading(false);
    closeModal();
  }

  return (
      <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-gray-100 px-4 py-3">
              <h2 className="text-lg font-medium text-gray-800 text-center">
                Sirene
              </h2>
              <p className="text-sm text-gray-600">
                Numéro Siren ou Siret
              </p>
            </div>

            <form className="px-4 py-3" onSubmit={handleCreateClient}>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                      id="link"
                      type="text"
                      name="siren_number"
                      placeholder="Numéro Siren ou Siret"
                      className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  {loading ? (
                      <Ellipsis className="h-4 w-4" />
                  ) : (
                      <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            <div className="bg-gray-100 px-4 py-3 flex justify-end">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Sirene
