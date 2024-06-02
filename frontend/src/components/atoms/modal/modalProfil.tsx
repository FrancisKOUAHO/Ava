'use client'

import React, {useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import { CircleX } from 'lucide-react';
import InputProfil from "@/components/ui/inputProfil";

type ModalProfilProps = {
    setOpenModalProfil: (open: boolean) => void;
    openModalProfil: boolean;
    title: string;
    description: string;
    inputs: Array<{ label: string, type: string }>;
};

const ModalProfil = ({ setOpenModalProfil, openModalProfil, title, description, inputs }: ModalProfilProps) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const handleCloseModal = () => {
        setOpenModalProfil(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderInput = (input: { label: string, type: string }) => {
        switch (input.type) {
            case 'prenom':
                return <InputProfil type="text" name="text" placeholder="Prénom" className="border border-solid h-12 w-full rounded-md pl-2" />;
            case 'nom':
                return <InputProfil type="text" name="text" placeholder="Nom" className="border border-solid h-12 w-full rounded-md pl-2" />;
            case 'number':
                return <InputProfil type="text" name="number" placeholder="Numero de téléphone" className="border border-solid h-12 w-full rounded-md pl-2" />;
            case 'date':
                return <InputProfil type="date" name="date" placeholder="Date de naissance *" className="border border-solid h-12 w-full rounded-md pl-2" />;
            case 'select':
                return (
                    <select className="border border-solid h-12 w-full rounded-md pl-2">
                        <option value="Madame">Madame</option>
                        <option value="Monsieur">Monsieur</option>
                    </select>
                );
            case 'file':
                return (
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-full">
                            <input
                                type="file"
                                name="file"
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <label className="block w-full h-12 border border-solid rounded-md pl-2 flex items-center justify-center text-gray-500 bg-white cursor-pointer">
                                <span className="w-full text-center">{imagePreviewUrl ? "File selected" : "No file chosen"}</span>
                            </label>
                        </div>
                        {imagePreviewUrl && (
                            <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full " />
                        )}
                    </div>
                );
            default:
                return <InputProfil type="select" name="text" placeholder="Civilité" className="border border-solid h-12 w-full rounded-md pl-2" />;
        }
    };

    return (
        <Transition.Root show={openModalProfil}>
            <Dialog className="flex z-50 items-center justify-center h-full w-full fixed top-0 left-0 pointer-events-none transition-all duration-200 ease-out" onClose={handleCloseModal}>
                <Transition.Child  enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity duration-300"/>
                </Transition.Child>
                <div className="bg-white z-20 rounded-lg max-w-[700px] max-h-[90%]  m-6 outline-none overflow-y-auto pointer-events-auto transition-all duration-300 ease-out w-full">
                    <div className="p-[1.25rem] bg-white border-solid border border-[#e7e7f3]">
                        <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="pl-[1.25rem] pr-[1.25rem] pb-[1.25rem] flex flex-col w-full  ">
                                <div className=" flex w-full justify-end">
                                    <CircleX className="hover:text-[#0075eb] cursor-pointer" onClick={handleCloseModal} />
                                </div>
                                <div className="mt-2">
                                    <div>
                                        <div className="flex flex-col align-center justify-space-between pb-2 mb-4">
                                            <div className="c-dialog-title-input-filename-edit">
                                                <Dialog.Title as="h3" className="font-[900] text-[2rem] leading-8 mb-2">
                                                    {title}
                                                </Dialog.Title>
                                                <span className="leading-3 text-[1.125rem] font-[600] text-[#516785]">
                                                    {description}
                                                </span>
                                            </div>
                                        </div>
                                        {inputs.map((input, index) => (
                                            <div key={index} className="flex flex-col mb-4">
                                                <label className="text-left text-[1rem] font-[700] mb-[0.25rem] text-[25385E]">{input.label}</label>
                                                <div className="h-[56px] w-full">
                                                    {renderInput(input)}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="w-full flex justify-end mt-6">
                                            <button type="submit" className="h-[36px] min-w-[64px] px-[16px] bg-[#0075eb] text-white text-[0.875rem] font-[500] rounded-md">
                                                Modifier
                                            </button>
                                        </div>
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

export default ModalProfil