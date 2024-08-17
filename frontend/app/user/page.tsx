"use client"
import { useEffect, useState, useCallback } from 'react';
import {FC} from 'react'
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from '@/app/types';

const UserPage: FC = () => {
    const router = useRouter()
    const { getUser } = useUser()
    const user = getUser()
    useEffect(() => {
        if (!user) {
            router.push('/user')
        }
    }, [user, router])

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Details about your account</CardDescription>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input disabled id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input disabled
                            id="email" defaultValue={user.email}/>
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>        
        </div>
    )
}

export default UserPage