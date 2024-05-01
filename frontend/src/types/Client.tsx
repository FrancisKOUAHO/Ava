export interface Client {
  id?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  company?: string
  vat_number?: string
  currency?: string
  language?: string
  created_at?: string
  [key: string]: string | undefined
}
