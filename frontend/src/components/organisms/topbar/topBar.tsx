'use client'

import {LogOut, User, Building2, Settings, Menu} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const TopBar = ({ openSidebar }: { openSidebar: () => void }) => {
  const { logout } = useAuth()

  return (
    <nav className="c-topbar">
      <div className="c-topbar__container">
        <div className="c-topbar__container__left">
          <Button onClick={openSidebar} className="md:hidden">
            <Menu className="text-black" />
          </Button>
        </div>
      </div>

      <div className="c-topbar__container">
        <div className="c-topbar__container__right">
          <div className="c-topbar__container__right__item">
            <div className="c-profile-avatar">
              <div className="flex justify-center items-center text-black gap-6">
                <DropdownMenu>
                  <Link  className="cursor-pointer hover:bg-blue-50 rounded-md h-[36px] py-1.5 px-2.5" href="/dashboard/account/">
                    <Settings className="cursor-pointer" />
                  </Link>
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
                      <Link href="#">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Paramètres</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/account">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profil</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard/compagny">
                        <DropdownMenuItem>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Mon entreprise</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
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
