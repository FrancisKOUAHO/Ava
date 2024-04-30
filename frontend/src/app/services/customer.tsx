// @ts-ignore
import api from '@/config/api';
import {Client} from "@/app/models/Client";

const camelToSnakeCase = (str: string): string => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);




const convertKeysToSnakeCase = (data: Client | Client[] ): Client | Client[]  => {
    if (Array.isArray(data)) {
        return data.map(item => convertKeysToSnakeCase(item));
    } else if (data !== null && data.constructor === Object) {
        return Object.keys(data).reduce((acc, key) => ({
            ...acc,
            [camelToSnakeCase(key)]: convertKeysToSnakeCase(data[key])
        }), {});
    }
    return data;
};

const fetchSirenDetails = async (siren_number: string): Promise<any> => {
    try {
        const response = await axios.post('business-data/scrappe-sirene', { siren_number });
        return convertKeysToSnakeCase(response.data); // Assuming conversion function exists and is imported
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error('Failed to fetch SIREN details: ' + error.message);
        } else {
            throw new Error('Failed to fetch SIREN details due to an unexpected error');
        }
    }
};
export const getSirenDetails = async (siren_number: string): Promise<any> => {
    try {
        const response = await api.get(`business-data/scrappe-sirene`, {
            params: convertKeysToSnakeCase({ siren_number })
        });
        return convertKeysToSnakeCase(response.data);
    } catch (error: unknown) {
        throw new Error('Failed to fetch SIREN details: ' + error.message);
    }
};

export const deleteClient = async (clientId: string): Promise<any> => {
    try {
        const response = await api.delete(`billing/customer/${clientId}`);
        return convertKeysToSnakeCase(response.data);
    } catch (error: unknown) {
        throw new Error('Failed to delete client: ' + error.message);
    }
};

export const fetchClientDetails = async (): Promise<any> => {
    try {
        const response = await api.get('billing/customer');
        return response.data.map((client: Client) => convertKeysToSnakeCase(client));
    } catch (error: unknown) {
        console.error('Failed to fetch client details:', error);
        throw error;
    }
};

export const updateCustomer = async (customerData: Client | Client[]): Promise<any> => {
    try {
        const response = await api.put(`billing/customer/${customerData.id}`, convertKeysToSnakeCase(customerData));
        return convertKeysToSnakeCase(response.data);
    } catch (error: unknown) {
        console.error('Failed to update customer:', error);
        throw error;
    }
};

export const createCustomer = async (customerData: Client | Client[]): Promise<any> => {
    try {
        const response = await api.post('billing/customer', customerData);
        return convertKeysToSnakeCase(response.data);
    } catch (error: unknown) {
        console.error('Failed to create customer:', error);
        throw error;
    }
};

export default fetchSirenDetails;
