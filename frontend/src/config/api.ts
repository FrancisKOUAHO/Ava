import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
})

api.defaults.withCredentials = true

export default api
