'use client'

import { FormEvent, useState,useEffect } from 'react'

import {
  CircleCheck,
  CircleX,
  Flag,
  ImagePlus,
  Info,
  PencilLine,
  Send,
  Image,
  SquareMenu,
  Trash2,
  Plus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ButtonUi from '@/components/atoms/button/button'
import Preview from '@/components/organisms/Preview/Preview'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/config/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem, CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {useFetchData} from "@/app/hooks/useFetch";




interface LineItem {
  name?: string
  price?: number
  unity?: string
  quantity?: number
  lineTotal?: number
  lineTotalTva?: number
  tva?: number
  [key: string]: any; // Allow additional properties dynamically

}

interface ApiResponse<T> {
  data: T;
}
interface InvoiceData {
  user_id: string
  id?: string
  client_id: string
  date?: string
  due_date?: string
  notes: string
  terms: string
  total_amount: number
  status: string
  discount: number
}

interface CustomerData {
  id?: string;
  user_id: string;
  userId: string;
  company: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  phone: string;
  email: string;
  last_name: string;
  lastName: string;
  first_name: string;
  firstName: string;
  vat_number: string
  vatNumber: string
  currency: string
  siren_number: string;
  sirenNumber: string;
}

interface SubTotal {
    name?: string;
    discount?: number;
    total?: number;
}


const Page = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [isEditable, setIsEditable] = useState<boolean[]>([])
  const [isEditableSubtotal, setIsEditableSubtotal] = useState<boolean>(false)
  const [editablenotes, setEditablenotes] = useState<boolean>(false)
  const [editableTerms, setEditableTerms] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState<CustomerData | null>({
    user_id: '',  // Default empty string or appropriate default value
    userId: '',
    company: '',
    address: '',
    city: '',
    zip: '',
    state: '',
    phone: '',
    email: '',
    last_name: '',
    lastName: '',
    first_name: '',
    firstName: '',
    vat_number: '',
    vatNumber: '',
    currency: '',
    siren_number: '',
    sirenNumber: '',
  });  const [notes, setnotes] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [subTotal, setSubTotal] = useState<SubTotal>({
    name: 'Réduction',
    discount: 0,  // default discount price as an example
    total: 0         // default total as an example
  });
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled out and update form validity
    console.log('Checking form validity:', lineItems);
    console.log(formValid);
    if(lineItems.length > 0){
      const allValid = lineItems.every((item: LineItem) => item.name && item.price && item.quantity);
      // check if all required fields are filled out in invoiceDat
      setFormValid(allValid);
    }
  }, [lineItems]);

  const validateInvoiceData = ( invoiceData: InvoiceData) => {
    const errors = [];

    // Check if the client ID is present and valid
    if (!invoiceData.client_id) {
      errors.push("Client ID is required.");
    }


    // Ensure the notes field is not empty if it's required
    if (!invoiceData.notes) {
      errors.push("notes is required.");
    }

    // Ensure terms are provided if necessary
    if (!invoiceData.terms) {
      errors.push("Terms of service must be accepted.");
    }

    // Further checks can be added here for other fields as necessary
    // Example: checking for a positive price, a date range, etc.

    return errors;
  };


  const {data: customersData} = useFetchData("billing/customer","customer")


  useEffect(() => {
    if (customer) {
      console.log('Updated customer:', customer);
    }


  }, [customer]); //
  const handleSelectCustomer = (customerId:string| undefined) => {
    const selectedCustomer : CustomerData = customersData.find((c:CustomerData) => c.id === customerId);
    setCustomer(selectedCustomer); // Schedules state update
    checkIfCustomerIsFull();
    setOpen(false); // Close the dropdown or popover
  };

  const checkIfCustomerIsFull = () => {
    console.log('Checking if customer is full:', customer);
    if (customer) {
      if (
          customer.firstName &&
          customer.lastName &&
          customer.company &&
          customer.address &&
          customer.city &&
          customer.zip &&
          customer.state &&
          customer.phone
      ) {
        setCompleted(true);
      } else {
        setCompleted(false);
      }
    }
  }

  const getInputClass = (value:string) => {
    return `mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white ${!value ? 'border-red-500' : ''}`;
  };


  const handleSubTotalChange = (field: keyof SubTotal, value: string | number) => {
    console.log(`Updating ${field} with value:`, value);
    setSubTotal((prevState: SubTotal) => {
      // Ensure `value` is always a number
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;

      const newState = {
        ...prevState,
        [field]: numericValue,
        total: field === 'discount' ? getSubTotal(getTotalInvoices(), numericValue) : prevState.total
      };

      console.log('New state:', newState);
      return newState;
    });
  };


  const makeEditable = (index: number): void => {
    setIsEditable((prevState: boolean[]) => {
      const newState = [...prevState]
      newState[index] = !newState[index]
      return newState
    })
  }

  const saveInvoice = (index: number): void => {
    setLineItems((prevState: LineItem[]) =>
      prevState.map((lineItem: LineItem, i: number) => {
        if (i === index) {
          return {
            ...lineItem,
            lineTotal: lineItem.price * lineItem.quantity,
          }
        }
        return lineItem
      }),
    )
  }

  const makeEditableSubtotal = (): void => {
    setIsEditableSubtotal((prevState: boolean) => !prevState)
  }

  const makeEditablenotes = (): void => {
    setEditablenotes((prevState: boolean) => !prevState)
  }

  const makeEditableTerms = (): void => {
    setEditableTerms((prevState: boolean) => !prevState)
  }

  const addLineItem = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    console.log('addLineItem function called');
    setLineItems((prevState: LineItem[]) => [
      ...prevState,
      {
        name: '',
        price: 0,
        tva: 0,
        unity: 'Journalier',
        quantity: 0,
        lineTotal: 0,
        lineTotalTva: 0,
      },
    ]);
  }

  const removeLineItem = (index: number): void => {
    setLineItems((prevState: LineItem[]) => prevState.filter((_: LineItem, i: number) => i !== index))
  }

  const SendCustomerMutation = useMutation<any, any, CustomerData>({
    mutationFn: () => {
      // Ensure 'customer' is not null before proceeding
      if (!customer) {
        throw new Error('Customer data is null. Cannot proceed with the mutation.');
      }

      // Safely access customer properties after the check
      const transformedData = toSnakeCase(customer);
      const endpoint = customer.id ? `billing/customer/${customer.id}` : 'billing/customer';
      const method = customer.id ? 'put' : 'post';

      // Send the transformed data to the API
      return api[method](endpoint, transformedData);
    },
    onError: (error: any) => {
      console.error('Error saving customer:', error);
    },
    onSuccess: () => {
      // Invalidate and refetch clients query to reflect the update/addition
      // queryClient.invalidateQueries(['clients']);
    }
  });



  type AnyObject = { [key: string]: any };

  const toSnakeCase = (obj: AnyObject): AnyObject => {
    const snakeCaseObj: AnyObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const transformedKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        snakeCaseObj[transformedKey] = obj[key];
      }
    }
    return snakeCaseObj;
  };


  const validateCustomerData = (customer:CustomerData) => {
    const errors = [];

    // List required fields and check if they are filled
    const requiredFields = [
      'userId', 'company', 'address', 'city', 'zip', 'state',
      'phone', 'email', 'lastName', 'firstName', 'sirenNumber'
    ];

    requiredFields.forEach(field => {
      // Check if the field in customer is undefined or null
      if (customer[field as keyof CustomerData] === undefined) {
        errors.push(`${field} is required.`);
      }
    });

    // Check for specific format requirements, e.g., email validation
    if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) {
      errors.push("Invalid email format.");
    }

    // Further validations can be added here (e.g., ZIP code format, phone number format)

    return errors;
  };


  const SendItemsDataMutation = useMutation<LineItem[], Error, LineItem>({
    mutationFn: (data) => api.post('billing/invoice-item-many', data),
    onError: (error: any) => {
      throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice-item'] });
    },
  });

  const SendInvoiceMutation = useMutation<any, Error, InvoiceData, ApiResponse<InvoiceData>>({
    mutationFn: (data) => {
      const fullData = {
        ...data,
        discount: data.discount,
        notes: data.notes,
        terms: data.terms,
      };
      return api.post('billing/invoice', fullData);
    },
    onError: (error: any) => {
      console.error('Error:', error.message);
      alert('Failed to send invoice.');  // User-friendly feedback
    },
    onSuccess: (response: ApiResponse<InvoiceData>) => {
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      if (response.data && response.data.id && Array.isArray(lineItems)) {
        const itemsWithInvoiceId: LineItem[] = lineItems.map(item => ({
          ...item,
          invoice_id: response.data.id  // Accessing ID from response.data
        }));
        const transformedData = itemsWithInvoiceId.map(toSnakeCase);

        console.log('Transformed line items data:', transformedData);
        SendItemsDataMutation.mutate(transformedData as LineItem[]);
        toast.success('Facture bien envoyée', {
          position: 'top-right',
        });// Ensure type compatibility
      } else {
        console.log("No lineItems to process or 'lineItems' is not an array");
      }
    },
  });

  const handleSubmit = () => {

    const newInvoiceData: InvoiceData = {
      client_id: customer?.id.toString(),  // Convert to string; check for existence
      discount: subTotal?.discount ?? 0,
      notes: notes,
      terms: terms,
      total_amount: Number((getTotalInvoices() - (subTotal.discount ?? 0)).toFixed(2)),  // Convert to number
      status: 'sent',
      user_id: user.id.toString(),  // Ensure this is a string
    };

    if (!formValid) {
      alert('Veuillez remplir tous les champs');  // Or handle this with a more user-friendly notification
      return;  // Stop the submission process
    }
    const validationInvoiceErrors = validateInvoiceData(newInvoiceData);


    if(validationInvoiceErrors.length > 0) {
      console.error("Validation errors:", validationInvoiceErrors);
      alert("Veuillez remplir tous les champs \n");
      return;  // Stop the submission process
    }

    const validationCustomerErrors = validateCustomerData(customer);
    if (validationCustomerErrors.length > 0) {
      console.error("Validation errors:", validationCustomerErrors);
      alert("Please correct the following errors: \n" + validationCustomerErrors.join("\n"));
      return;  // Stop the submission process if there are errors
    }

    // Construct the data object from your form state or context


    // Only call the mutation if all required fields are properly filled
    if (newInvoiceData.client_id) {
      SendInvoiceMutation.mutate(newInvoiceData);
    } else {
      console.error('Customer data is incomplete.');
    }
  };


  const handleSendInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as {
      [key: string]: string;
    };

    // Check if `customer` is null or undefined
    if (!customer) {
      console.error('Customer is not available.');
      toast.error('Customer not available', {
        position: 'top-right',
      });
      return;
    }

    // Assuming `user` is always defined, otherwise, add a similar null check
    const invoiceData: any = {
      user_id: user.id,
      client_id: customer?.id,
      date: new Date().toISOString(),
      due_date: new Date().toISOString(),
      total_amount: 0,
      discount: 0,
      notes: values.notes, // Correct the spelling from "notess" to "notes"
      terms: values.terms,
      status: 'draft',
    };

    // Prepare line items data
    const lineItemsData: LineItem[] = lineItems.map((lineItem: LineItem) => ({
      name: lineItem.name,
      price: lineItem.price,
      unity: lineItem.unity,
      quantity: lineItem.quantity,
      lineTotal: lineItem.lineTotal,
      lineTotalTva: lineItem.lineTotalTva,
      tva: lineItem.tva,
    }));
    console.log('lineItemsData', lineItemsData);

    try {
      // Send the invoice
      const response = await SendInvoiceMutation.mutateAsync(invoiceData);

      if (!response) {
        toast.error('Invoice not sent', {
          position: 'top-right',
        });
        throw new Error('unknown error');
      }

      toast.success('Invoice sent successfully', {
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Error sending invoice', {
        position: 'top-right',
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setLineItems((prevItems: LineItem[]) =>
        prevItems.map((item, idx) => {
          if (idx === index) {
            const updatedItem = { ...item, [field]: value };

            // Automatically calculate lineTotal if price, quantity, or tva changes
            if (field === 'price' || field === 'quantity' || field === 'tva') {
              updatedItem.lineTotal = Number(updatedItem.price) * Number(updatedItem.quantity);
              updatedItem.lineTotalTva = updatedItem.lineTotal * (1 + Number(updatedItem.tva) / 100);
            }

            return updatedItem;
          }

          return item;
        })
    );

    // Update subtotal state
    setSubTotal((prevState: SubTotal) => ({
      ...prevState, // Keep other values unchanged
      total: getSubTotal(getTotalInvoices()),
    }));
  };

  const changeCustomer = () =>{
    SendCustomerMutation.mutate();
  }

  const getTotalInvoices = (withTva = true) => {
    if (!Array.isArray(lineItems)) {
      return 0;
    }

    return lineItems.reduce((acc, lineItem) => {
      // Ensure the ternary operator's result is used correctly in the summation
      return acc + (withTva ? lineItem.lineTotalTva : lineItem.lineTotal);
    }, 0);
  };

  const getSubTotal = (pTotal:number, pdiscount:number =0):number => {
    return pTotal - (pTotal * pdiscount / 100);
  }

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    const updatedCustomer = { ...customer, [field]: value };
    setCustomer(updatedCustomer);
    checkIfCustomerIsFull();
  }

  const handleTest = () => {
    console.log("formValid")
    console.log(formValid)
  }

  return (
    <section className="px-6 py-6">
      <form onSubmit={handleSendInvoice} className="flex gap-12 text-black">

        <div className="w-3/4">
          <header className="flex justify-between items-center gap-12">
            <div className="flex justify-center items-center">
              <h3 className="text-black text-lg font-semibold">
                Créer une Facture
              </h3>
            </div>
            <div className="text-black">
              <a href="/" className="flex justify-center items-center gap-2">
                <SquareMenu />
                Liste de facture
              </a>
            </div>
          </header>

          <div className="bg-[#f2f5fd] p-6 mt-6 rounded-xl overflow-auto h-[80vh]">
            <div className="flex flex-col items-center">
              {/*<div className="flex justify-between items-center w-full mb-6">*/}
              {/*  <p className="flex justify-center items-center gap-2">*/}
              {/*    <Image className="text-blue-700" />*/}
              {/*    Add Logo*/}
              {/*  </p>*/}
              {/*  <Info />*/}
              {/*</div>*/}

              {/*<div className="border border-dashed border-gray-500 relative bg-[#e7effc] rounded-xl my-6 w-full">*/}
              {/*  <input*/}
              {/*    type="file"*/}
              {/*    name="logo"*/}
              {/*    multiple*/}
              {/*    className="cursor-pointer relative block opacity-0 w-full h-full p-20 z-50"*/}
              {/*  />*/}
              {/*  <div className="text-center p-10 absolute top-0 right-0 left-0 m-auto">*/}
              {/*    <ImagePlus className="text-blue-700 w-20 h-20 m-auto mb-2" />*/}
              {/*    <h4>*/}
              {/*      Glissez une image directement{' '}*/}
              {/*      <span className="text-blue-700">brower</span>*/}
              {/*    </h4>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="bg-[#e7effc] rounded-xl w-full my-6 p-2">
                {customersData && (

                    <Popover open={open} onOpenChange={setOpen} >
                      <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                          {customer
                              ? `${customer.firstName ?? ''} ${customer.lastName ?? ''}`
                              : "Sélectionner une entreprise"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher client..." />
                      <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                        {customersData.map((listOfCustomerNames:CustomerData) => (
                            <CommandItem
                                key={listOfCustomerNames.id}
                                value={listOfCustomerNames.id}
                                onSelect={() => handleSelectCustomer(listOfCustomerNames.id)}

                            >
                              <Check
                                  className={cn(
                                      "mr-2 h-4 w-4",
                                      customer === listOfCustomerNames.id ? "opacity-100" : "opacity-0"
                                  )}
                              />
                              {listOfCustomerNames.firstName}
                            </CommandItem>
                        ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                    )}
              </div>

              <div className="bg-[#e7effc] rounded-xl w-full">
                <div className="flex justify-between items-center p-6">
                  <p className="flex justify-center items-center gap-2">
                    <Flag className="text-blue-700" />
                    Détails entreprise
                  </p>
                  {completed ? (
                    <CircleCheck className="text-green-500" />
                  ) : (
                    <CircleX className="text-red-500" />
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="sirenNumber" className="mb-2">
                        Numero de Siren
                      </Label>
                      <Input
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                          type="text"
                          id="sirenNumber"
                          name="sirenNumber"
                          value={customer ? customer.sirenNumber  : ''}
                          onChange={(e) => handleCustomerChange('sirenNumber',  e.target.value)}

                          placeholder="987654321"
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="firstName" className="mb-2">
                        Prénom
                      </Label>
                      <Input
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={customer ? customer.firstName  : ''}
                          onChange={(e) => handleCustomerChange('firstName',  e.target.value)}

                          placeholder="Jean"
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="lastName" className="mb-2">
                        Nom
                      </Label>
                      <Input
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={customer ? customer.lastName  : ''}
                          onChange={(e) => handleCustomerChange('lastName',  e.target.value)}

                          placeholder="Dupont"
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="company" className="mb-2">
                        Société
                      </Label>
                      <Input
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                          type="text"
                          id="company"
                          name="company"
                          value={customer ? customer.company  : ''}
                          onChange={(e) => handleCustomerChange('company',  e.target.value)}

                          placeholder="Super Corp"
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="currency" className="mb-2">
                        Devise
                      </Label>
                      <Input
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                          type="text"
                          id="currency"
                          name="currency"
                          value={customer ? customer.currency  : ''}
                          onChange={(e) => handleCustomerChange('currency',  e.target.value)}

                          placeholder="EUR"
                      />
                    </div>
                    {/*<div className="grid w-full max-w-sm items-center gap-1.5">*/}
                    {/*  <Label htmlFor="vatNumber" className="mb-2">*/}
                    {/*    Numéro de TVA*/}
                    {/*  </Label>*/}
                    {/*  <Input*/}
                    {/*      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"*/}
                    {/*      type="text"*/}
                    {/*      id="vatNumber"*/}
                    {/*      name="vatNumber"*/}
                    {/*      value={customer ? customer.vatNumber  : ''}*/}
                    {/*      onChange={(e) => handleCustomerChange({...customer, vatNumber: e.target.value})}*/}

                    {/*      placeholder="987"*/}
                    {/*  />*/}
                    {/*</div>*/}


                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="address" className="mb-2">
                        Addresse principale
                      </Label>
                      <Input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                        type="text"
                        id="address"
                        name="address"
                        value={customer ? customer.address  : ''}
                        onChange={(e) => handleCustomerChange('address',  e.target.value)}

                        placeholder="626 W Pender St #500, Vancouver, BC V6B 1V9, Canada"
                      />
                    </div>

                    {/*<div className="grid w-full max-w-sm items-center gap-1.5">*/}
                    {/*  <Label htmlFor="address2" className="mb-2">*/}
                    {/*    Addresse 2*/}
                    {/*  </Label>*/}
                    {/*  <Input*/}
                    {/*    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"*/}
                    {/*    type="text"*/}
                    {/*    id="address2"*/}
                    {/*    name="address2"*/}

                    {/*    placeholder="626 W Pender St #500, Vancouver, BC V6B 1V9, Canada"*/}
                    {/*  />*/}
                    {/*</div>*/}

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="city" className="mb-2">
                        Ville <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                        type="text"
                        name="city"
                        id="city"
                        value={customer ? customer.city : ''}
                        onChange={(e) => handleCustomerChange('city',  e.target.value)}

                        placeholder="Vancouver"
                      />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="zip" className="mb-2">
                        Code Postal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                        type="text"
                        name="zip"
                        id="zip"
                        value={customer ? customer.zip : ''}
                        onChange={(e) => handleCustomerChange('zip',  e.target.value)}

                        placeholder="V6B 1V9"
                      />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="state" className="mb-2">
                        Pays <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                        type="text"
                        id="state"
                        name="state"
                        value={customer ? customer.state : ''}
                        onChange={(e) => handleCustomerChange('state',  e.target.value)}

                        placeholder="Canada"
                      />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="phone" className="mb-2">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customer ? customer.phone || '' : ''}
                        // onChange={(e) => handleCustomerChange({phone: e.target.value})}
                        onChange={(e) => handleCustomerChange('phone', e.target.value)} // Fournir le nom du champ et la nouvelle valeur

                        placeholder="+1 604-682-2344"
                      />
                    </div>


                    <ButtonUi label="Mettre à jour entreprise" type="button" onClick={() => changeCustomer()} size="small"// Tailwind classes for padding and text size
                    />

                  </div>
                </div>
              </div>

              <div className="rounded-xl my-6 w-full">
                <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                  <thead className="border-b-2 border-gray-300 mb-4">
                    <tr>
                      <th className="flex items-center gap-2 p-3 text-center">
                        Produit
                      </th>
                      <th className="p-3 text-center">Prix</th>
                      <th className="p-3 text-center">Quantité</th>
                      <th className="p-3 text-center">Unité</th>
                      <th className="p-3 text-center">TVA</th>
                      <th className="p-3 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((lineItem, index) => (
                      <tr key={index} className="bg-[#e7effc] rounded-xl">
                        <td className="flex items-center gap-2 p-3 text-center">
                          {!isEditable[index] ? (
                            <button
                              className="flex items-center gap-2 w-full"
                              onClick={() => makeEditable(index)}
                            >
                              Entrer un produit à facturer
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="name"
                              />
                            </button>
                          ) : (
                              <Input
                                  className={getInputClass(lineItem.name)}
                                  type="text"
                                  id={`name-${index}`}
                                  name={`name-${index}`}
                                  placeholder="Nom produit"
                                  disabled={!isEditable[index]}
                                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                  value={lineItem.name || ''}
                                  readOnly={!isEditable[index]}
                              />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!isEditable[index] ? (
                            <button
                              className="flex justify-center items-center gap-2 w-full"
                              onClick={() => makeEditable(index)}
                            >
                              €{lineItem.price}
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                              <Input
                                  className={getInputClass(lineItem.price)}
                                  type="number"
                                  id={`price-${index}`}
                                  name={`price-${index}`}
                                  placeholder="100"
                                  disabled={!isEditable[index]}
                                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                  value={lineItem.price || ''}
                                  readOnly={!isEditable[index]}
                              />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!isEditable[index] ? (
                            <button
                              className="flex justify-center items-center gap-2 w-full"
                              onClick={() => makeEditable(index)}
                            >
                              {lineItem.quantity}
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                              <Input
                                  className={getInputClass(lineItem.quantity)}
                                  type="number"
                                  id={`quantity-${index}`}
                                  name={`quantity-${index}`}
                                  placeholder="1"
                                  disabled={!isEditable[index]}
                                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                  value={lineItem.quantity || ''}
                                  readOnly={!isEditable[index]}
                              />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!isEditable[index] ? (
                              <button
                                  className="flex justify-center items-center gap-2 w-full"
                                  onClick={() => makeEditable(index)}
                              >
                                {lineItem.unity}
                                <PencilLine className="w-4 h-4 hover:text-blue-700" id="item" />
                              </button>
                          ) : (
                              <select
                                  className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                                  id="unity"
                                  name={`unity-${index}`}
                                  value={lineItem.unity}
                                  onChange={(e) => handleItemChange(index, 'unity', e.target.value)}
                              >
                                <option value="Journalier">Journalier</option>
                                <option value="Horraire">Horraire</option>
                                <option value="Hebdomadaire">Hebdomadaire</option>
                                <option value="Mensuel">Mensuel</option>
                                <option value="Annuel">Annuel</option>
                                <option value="Total">Total</option>
                              </select>
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {!isEditable[index] ? (
                            <button
                              className="flex justify-center items-center gap-2 w-full"
                              onClick={() => makeEditable(index)}
                            >
                              {lineItem.unity}
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                            <Input
                                className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                                type="text"
                                id="tva"
                                name={`tva-${index}`}
                                placeholder="Tva"
                                disabled={!isEditable[index]}
                                onChange={(e) => handleItemChange(index, 'tva', e.target.value)}
                                value={lineItem.tva}
                                readOnly={!isEditable[index]}
                            />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center">
                            {!isEditable[index] ? (
                              <button
                                className="flex justify-center items-center gap-2 w-full"
                                onClick={() => makeEditable(index)}
                              >
                                €{lineItem.lineTotalTva}
                                <PencilLine
                                  className="w-4 h-4 hover:text-blue-700"
                                  id="item"
                                />
                              </button>
                            ) : (
                                <Input
                                    className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                                    type="number"
                                    id="lineTotalTva"
                                    name={`lineTotalTva-${index}`}
                                    placeholder="100"
                                    readOnly // Make it read-only since it's automatically calculated
                                    value={lineItem.lineTotalTva.toFixed(2)} // Assuming lineTotal is a number
                                />

                            )}

                            {isEditable[index] ? (
                                <button
                                    className="flex justify-center items-center gap-2 w-full"
                                    onClick={() => removeLineItem(index)}
                                >
                                  <Trash2 className="w-4 h-4 hover:text-blue-700" />
                                </button>
                            ) : null}

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center items-center my-6 gap-2 text-sm">
                  <button
                    className="bg-blue-600 py-1 px-2 text-white"
                    onClick={addLineItem}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    className="text-blue-700 text-sm"
                    onClick={addLineItem}
                  >
                    Ajouter un item
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-full mb-6">
                <div className="flex justify-start items-center w-full gap-3 mb-2">
                  <p className="text-sm">Appliquer une réduction</p>
                  <hr className="w-full text-blue-700" />
                </div>
                <div>
                  <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                    <thead className="border-b-2 border-gray-300 mb-4">
                    <tr>
                      <th className="p-3 text-center">Nom</th>
                      <th className="p-3 text-center">Montant de Réduction</th>
                      <th className="p-3 text-center">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#e7effc] rounded-xl">
                        <td className="flex items-center gap-2 p-3 text-center">
                          {!isEditableSubtotal ? (
                            <button
                              className="flex items-center gap-2 w-full"
                              onClick={makeEditableSubtotal}
                            >
                              Réduction
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="text"
                              id="name"
                              name="name"
                              value={subTotal?.name}
                              onChange={(e) => handleSubTotalChange('name', e.target.value)}
                              placeholder="Réduction"
                              readOnly={!isEditableSubtotal}
                              disabled={!isEditableSubtotal}


                            />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!isEditableSubtotal ? (
                            <button
                              className="flex justify-center items-center gap-2 w-full"
                              onClick={makeEditableSubtotal}
                            >
                              5%
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="number"
                              name="discount"
                              id="discount"
                              value={(subTotal.discount??0)}
                              onChange={(e) => handleSubTotalChange('discount', e.target.value)}
                              placeholder="100"
                              readOnly={!isEditableSubtotal}
                              disabled={!isEditableSubtotal}

                            />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {!isEditableSubtotal ? (
                            <button
                              className="flex justify-center items-center gap-2 w-full"
                              onClick={makeEditableSubtotal}
                            >
                              €100
                              <PencilLine
                                className="w-4 h-4 hover:text-blue-700"
                                id="item"
                              />
                            </button>
                          ) : (
                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="number"
                              name="discountTotal"
                              id="discountTotal"
                              disabled={!isEditableSubtotal}
                              readOnly
                              placeholder="1"
                              value={(getTotalInvoices() - (subTotal.discount ?? 0)).toFixed(2)}

                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col w-full mb-6">
                <div className="flex justify-start items-center w-full gap-3 mb-2">
                  <p className="text-sm">Total</p>
                  <hr className="w-full text-blue-700" />
                </div>
                <div>
                  <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                    <thead className="border-b-2 border-gray-300 mb-4">
                    <tr>

                      <th className="p-3 text-center">Total HT</th>
                      <th className="p-3 text-center">Total sans réduction</th>
                      <th className="p-3 text-center">Total avec réduction</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#e7effc] rounded-xl">
                        <td className="flex items-center gap-2 p-3 text-center">

                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="text"
                              name="total"
                              id="total"
                              placeholder="100"
                              value={(getTotalInvoices(false)-(subTotal.discount??0)).toFixed(2)}

                              readOnly

                            />
                        </td>
                        <td className="p-3 text-center">

                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="number"
                              id="totalTva"
                              name="totalTva"
                              value={(getTotalInvoices()).toFixed(2)}
                              readOnly
                              placeholder="100"
                            />
                        </td>
                        <td className="p-3 text-center">

                            <Input
                              className="mt-1 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                              type="number"
                              id="totalTva"
                              name="totalTva"
                              value={(getTotalInvoices() - (subTotal.discount ?? 0)).toFixed(2)}

                              readOnly
                              placeholder="100"
                            />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col w-full mb-6">
                <div>
                  <table className="table w-full text-gray-400 border-separate space-y-6 text-sm">
                    <tbody>
                      <tr>
                        <td className="font-black text-black">
                          <h5>Total à régler</h5>
                        </td>
                        <td className="p-3 text-center font-black text-black">
                          {(getTotalInvoices() - (subTotal.discount??0)).toFixed(2)}€
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full my-">
                <div className="flex justify-between items-center w-full gap-3 mb-2">
                  <p className="font-black text-sm">notess</p>
                </div>
                <div className="grid w-full items-center gap-1.5 my-2">
                  {!editablenotes ? (
                    <button
                      className="w-full text-sm font-normal"
                      onClick={makeEditablenotes}
                    >
                      Les factures devront être réglées en Euros (€) dès
                      réception, et au plus tard dans un délai de X jours (délai
                      inférieur ou égal à 45 jours fin de mois ou 60 jours) à
                      partir de la date de leur émission
                      <PencilLine
                        className="w-4 h-4 hover:text-blue-700"
                        id="notes"
                      />
                    </button>
                  ) : (
                    <textarea
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                      id="notess"
                      name="notess"
                      placeholder="notess"
                      onChange={(e) => setnotes(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center w-full gap-3 mb-2">
                  <p className="font-black text-sm">Termes</p>
                </div>
                <div className="grid w-full items-center gap-1.5 my-2">
                  {!editableTerms ? (
                    <button
                      className="w-full text-sm font-normal"
                      onClick={makeEditableTerms}
                    >
                      Les factures devront être réglées en Euros (€) dès
                      réception, et au plus tard dans un délai de X jours (délai
                      inférieur ou égal à 45 jours fin de mois ou 60 jours) à
                      partir de la date de leur émission
                      <PencilLine
                        className="w-4 h-4 hover:text-blue-700"
                        id="terms"
                      />
                    </button>
                  ) : (
                    <textarea
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:bg-white"
                      id="terms"
                      name="terms"
                      placeholder="Terms"
                      onChange={(e) => setTerms(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 w-full my-8">
                <ButtonUi
                  label="Enregistrer en tant que brouillon"
                  type="button"
                    onClick={() => {handleTest()}}
                />
                <ButtonUi
                    label="Envoyer la facture"
                    type="button"  // Make sure to use "button" if it's not a submit inside a form, else use "submit"
                    onClick={handleSubmit}
                />

              </div>
            </div>
          </div>
        </div>

        <Preview />
      </form>
    </section>
  )
}

export default Page
