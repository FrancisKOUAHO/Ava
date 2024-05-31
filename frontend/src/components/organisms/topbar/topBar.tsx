'use client'

import {
  LogOut,
  User,
  Cloud,
  CreditCard,
  LifeBuoy,
  Mail,
  Settings,
  UserPlus,
  Users,
  FilePenLine,
  Building2,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CommandK from '@/components/atoms/command/CommandK'
import ButtonUI from '@/components/atoms/button/button'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import api from '@/config/api'
import { useEffect } from 'react'

const TopBar = () => {
  const { logout, setUser, user } = useAuth()

  const whoami = async () => {
    const response = await api.get('auth/whoami')

    console.log(response)

    if (!response) {
      throw new Error('unknown error')
    }

    setUser(response.data)
  }

  useEffect(() => {
    whoami()
  }, [])

  return (
    <nav className="c-topbar">
      <div className="c-topbar__logo">
        <h2 className="text-black text-xl">
          Bonjour {(user && user.full_name) || (user && user.email)}
        </h2>
      </div>

      <div className="c-topbar__container">
        <div className="c-topbar__container__left">
          <Link href="/dashboard/invoices/add">
            <ButtonUI
              label="Créer une facture"
              icon={<FilePenLine className="w-5 h-5" />}
            />
          </Link>
        </div>
      </div>

      <div className="c-topbar__container">
        <div className="c-topbar__container__right">
          <div className="c-topbar__container__right__item">
            <div className="c-profile-avatar">
              <div className="flex justify-center items-center text-black gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <img
                        src="https://avatars.githubusercontent.com/u/1402241?v=4"
                        className="w-8 h-8 rounded-full"
                        alt="avatar"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <Link href="/dashboard/account">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profil</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem disabled>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Equipe</span>
                      </DropdownMenuItem>
                      <Link href="/dashboard/compagny">
                        <DropdownMenuItem>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Mon entreprise</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Cloud className="mr-2 h-4 w-4" />
                      <span>API</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopBar
