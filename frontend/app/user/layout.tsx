'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/useUser"
import { useEffect } from "react"
import{ Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const router = useRouter()

    const { getUser, logout } = useUser()
    const user = getUser()
    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router])


  return (
    <div 

    lang="en">
      <header className="flex justify-between items-center p-4 bg-gray-400">
        <h1 className="text-2xl font-bold">Intake Questionnaire System (IQS)</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <Menu className="cursor-pointer" />
              
      
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
              {user?.role === 'admin' && (
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/user/admin')
                  }}
                >
                  Admin Panel
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
              onClick={() => {
                router.push('/user')
              }}
              >Profile</DropdownMenuItem>
                <DropdownMenuItem
              onClick={() => {
                router.push('/user/questionnaire')
              }}
              >Questionnaires</DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              logout()
              router.push('/');
            }}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      {children}
    </div>
    )
}
