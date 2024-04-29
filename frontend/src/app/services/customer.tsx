import api from '@/config/api';
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Convertit un string de snake_case à camelCase
const snakeToCamelCase = str => str.replace(/(_\w)/g, matches => matches[1].toUpperCase());

const convertKeysToCamelCase = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => convertKeysToCamelCase(item));
    } else if (data !== null && data.constructor === Object) {
        return Object.keys(data).reduce((acc, key) => ({
            ...acc,
            [snakeToCamelCase(key)]: convertKeysToCamelCase(data[key])
        }), {});
    }
    return data;
};
// Convertit les clés d'un objet ou d'un tableau d'objets de camelCase à snake_case
const convertKeysToSnakeCase = (data) => {
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

// Convertit les clés d'un objet ou d'un tableau d'objets de snake_case à camelCase

const fetchSirenDetails = async (siren_number) => {
    try {
        const response = await api.post('business-data/scrappe-sirene', { siren_number });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch SIREN details: ' + error.message);
    }
}
export const getSirenDetails = async (siren_number) => {
    try {
        const response = await api.get(`business-data/scrappe-sirene`, {
            params: convertKeysToSnakeCase({ siren_number })
        });
        return convertKeysToSnakeCase(response.data);
    } catch (error) {
        throw new Error('Failed to fetch SIREN details: ' + error.message);
    }
};

export const deleteClient = async (clientId) => {
    try {
        const response = await api.delete(`billing/customer/${clientId}`);
        return convertKeysToSnakeCase(response.data);
    } catch (error) {
        throw new Error('Failed to delete client: ' + error.message);
    }
};

export const fetchClientDetails = async () => {
    try {
        const response = await api.get('billing/customer');
        return response.data.map(client => convertKeysToSnakeCase(client));
    } catch (error) {
        console.error('Failed to fetch client details:', error);
        throw error;
    }
};

// Fonction pour mettre à jour un client existant
export const updateCustomer = async (customerData) => {
    try {
        const response = await api.put(`billing/customer/${customerData.id}`, convertKeysToSnakeCase(customerData));
        return convertKeysToSnakeCase(response.data);
    } catch (error) {
        console.error('Failed to update customer:', error);
        throw error;
    }
};


export const createCustomer = async (customerData) => {
    try {
        const response = await api.post('billing/customer', customerData);
        return convertKeysToSnakeCase(response.data);
    } catch (error) {
        console.error('Failed to create customer:', error);
        throw error;
    }
};

export default fetchSirenDetails;
