// @ts-nocheck

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';

interface DeleteCustomerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteCustomer({ isOpen, onClose, onConfirm }: DeleteCustomerProps) {
    // Function called when deletion is confirmed
    const handleDelete = () => {
        onConfirm(); // Execute deletion logic or other actions
        onClose(); // Close the modal after confirmation
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Confirmation de la Suppression
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Etes-vous sûr de vouloir supprimer ce client? Cette action est irréversible.
                                </p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                                <Button variant="destructive" className="ml-2" onClick={handleDelete}>Confirmer</Button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default DeleteCustomer;
