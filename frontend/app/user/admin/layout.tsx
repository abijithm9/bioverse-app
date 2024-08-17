
'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/useUser"
import { useEffect } from "react"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const router = useRouter()

    const { getUser } = useUser()
    useEffect(() => {
        const user = getUser()
        if (user?.role !== 'admin') {
            router.push('/')
        }
    }, [])

  return (
    <div 
    lang="en">
      {children}
    </div>
  )
}
