import api from '@/config/api'
import { Client } from '@/types/Client'

const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

const convertKeysToSnakeCase = (
  data: Client | string,
): Client | Client[] | string => {
  if (Array.isArray(data)) {
    return data.map((item: Client) => convertKeysToSnakeCase(item)) as Client[]
  } else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc: Client, key: string) => {
      const snakeCaseKey = camelToSnakeCase(key)
      const value = data[key]
      if (typeof value === 'string') {
        acc[snakeCaseKey] = value
      } else if (Array.isArray(value)) {
        acc[snakeCaseKey] = JSON.stringify(
          (value as Client[]).map((item: Client) =>
            convertKeysToSnakeCase(item),
          ),
        )
      } else if (value !== null && typeof value === 'object') {
        acc[snakeCaseKey] = JSON.stringify(
          convertKeysToSnakeCase(value as Client),
        )
      }
      return acc
    }, {} as Client)
  }
  return data
}

export const getSirenDetails = async (siren_number: string): Promise<any> => {
  try {
    const response = await api.get(`business-data/scrappe-sirene`, {
      params: convertKeysToSnakeCase({ siren_number }),
    })
    return convertKeysToSnakeCase(response.data)
  } catch (error: unknown) {
    throw new Error('Failed to fetch SIREN details: ' + error)
  }
}

export const deleteClient = async (clientId: string): Promise<any> => {
  try {
    const response = await api.delete(`billing/customer/${clientId}`)
    return convertKeysToSnakeCase(response.data)
  } catch (error: unknown) {
    throw new Error('Failed to delete client: ' + error)
  }
}

export const fetchClientDetails = async (): Promise<any> => {
  try {
    const response = await api.get('billing/customer')
    return response.data.map((client: Client) => convertKeysToSnakeCase(client))
  } catch (error: unknown) {
    console.error('Failed to fetch client details:', error)
    throw error
  }
}

export const updateCustomer = async (
  customerData: Client | Client[],
): Promise<any> => {
  try {
    if (Array.isArray(customerData)) {
      const responses = await Promise.all(
        customerData.map(async (client) => {
          const response = await api.put(
            `billing/customer/${client.id}`,
            convertKeysToSnakeCase(client),
          )
          return convertKeysToSnakeCase(response.data)
        }),
      )
      return responses
    } else {
      const response = await api.put(
        `billing/customer/${customerData.id}`,
        convertKeysToSnakeCase(customerData),
      )
      return convertKeysToSnakeCase(response.data)
    }
  } catch (error: unknown) {
    console.error('Failed to update customer:', error)
    throw error
  }
}

export const createCustomer = async (
  customerData: Client | Client[],
): Promise<any> => {
  try {
    const response = await api.post('billing/customer', customerData)
    return convertKeysToSnakeCase(response.data)
  } catch (error: unknown) {
    console.error('Failed to create customer:', error)
    throw error
  }
}
