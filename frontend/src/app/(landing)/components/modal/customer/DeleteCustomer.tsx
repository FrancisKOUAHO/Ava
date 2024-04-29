import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';

function DeleteCustomer({ isOpen, onClose, onConfirm }) {
    // Fonction appelée lors de la confirmation de la suppression
    const handleDelete = () => {
        console.log('Item deleted');
        onConfirm(); // Exécute toute logique de suppression ou d'autres actions
        onClose(); // Ferme la modale après confirmation
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Confirm Deletion
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                                </p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button variant="ghost" onClick={onClose}>Annuler</Button>
                                <Button variant="solid" className="ml-2" onClick={handleDelete}>Confirmer</Button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default DeleteCustomer;
