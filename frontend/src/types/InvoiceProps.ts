export interface InvoiceProps {
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
