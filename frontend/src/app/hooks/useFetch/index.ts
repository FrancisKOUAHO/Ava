import { useQuery } from '@tanstack/react-query'
import api from '@/config/api'

const fetchData = async (url: string) => {
    const response = await api.get(url)
    return response.data
}

const useFetchData = (url: string, keydata: string) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [`${keydata}`],
        queryFn: () => fetchData(url),
    })

    return { data, isLoading, isError, error }
}

const useFetchDataId = (url: string, keydata: string, id: string | null) => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [`${keydata}`],
        queryFn: () => fetchData(`${url}/${id}`),
    })

    return { data, isLoading, isError, error }
}

const postData = async (url: string, body: any) => {
    const { data } = await api.post(url, body)
    return { data }
}

const usePostData = (url: string, body: any, keydata: string) =>
    useQuery({
        queryKey: [`${keydata}`],
        queryFn: async () => postData(url, body),
    })

export { useFetchData, usePostData, useFetchDataId }
