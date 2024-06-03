export interface InvoiceProps {
  user_id: string
  id?: string
  client_id: string
  date?: string
  due_date?: string
  notes: string
  terms: string
  bank: string
  iban: string
  bic: string
  total_amount: number
  status: string
  discount: number
}

export interface Client {
  id: string
  firstName: string
  lastName: string
}

export type InvoiceStatus =
  | 'envoyé'
  | 'brouillon'
  | 'payé'
  | 'caduque'
  | 'en cours de paiement'

export interface InvoiceType {
  client: Client
  clientId: string
  createdAt: string
  date: string | null
  discount: string
  dueDate: string | null
  id: string
  invoiceDate: string | null
  invoiceNumber: string | null
  notes: string
  status: InvoiceStatus
  terms: string
  total: string
  path:string
  totalAmount: string
  updatedAt: string
  userId: string | undefined
}
