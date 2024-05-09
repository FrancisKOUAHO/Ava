'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import api from '@/config/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const AuthContext = createContext<any>({
  user: null,
  connectWithGoogle: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router: AppRouterInstance = useRouter()

  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<any>(null)
  const [loadingToken, setLoadingToken] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const connectWithGoogle = async () => {
    const response = await api.get('auth/connect-to-googlee')
    console.log(response)
  }

  const whoami = async () => {
    const response = await api.get('auth/whoami')

    if (!response) {
      throw new Error('unknown error')
    }
    setUser(response.data)
  }

  const logout = async () => {
    const response = await api.delete('auth/sign-out')

    console.log(response)

    if (response.status === 200) {
      localStorage.removeItem('access_token')
      setToken(null)
      setUser(null)

      toast.success('You have been logged out', {
        position: 'bottom-center',
      })

      router.push('/login')
    }
  }

  useEffect(() => {
    whoami()
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [isClient])

  return (
    <>
      {isClient && (
        <AuthContext.Provider
          value={{
            setToken,
            connectWithGoogle,
            logout,
            user,
            token,
            loadingToken,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  )
}

export default AuthContextProvider
