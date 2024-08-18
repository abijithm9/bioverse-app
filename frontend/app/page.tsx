"use client"
import { useEffect, useState, useCallback } from 'react'
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { LoginResponse } from './types';
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/hooks/useUser"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter();
    const { toast } = useToast()
    const { setUser, getUser } = useUser()

    useEffect(() => {
        const user = getUser()
        if (user) {
            router.push('/user')
        }
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            const response = await axios.post<LoginResponse>('https://bioverse-backend-f40e702ba4ff.herokuapp.com/api/login', {
                email,
                password
            })
            if (response.data.success) {
                toast({
                    title: "Login Success",
                })
            
            const { id, name, email: userEmail, role } = response.data
            setUser({ id, name, email: userEmail, role })
            if (role === 'admin') {
                router.push('/user/admin')
            } else {
                router.push('/user/questionnaire')
            }
        } else {
            toast({
                    title: "Login Failed",
                })
            console.error("Invalid Credentials")
        }
        } catch (err) {
            toast({
                    title: "Login Failed",
                })
            console.error("Invalid Credentials")
        }
    }, [email, password, router, setUser, toast])

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card>
                <CardHeader>
                    <CardTitle>Login Account</CardTitle>
                    <CardContent className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <div style={{ position: 'relative' }}>
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <button 
                                style={{ position: 'absolute', right: '10px', top: '10px' }} 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                            </button>
                        </div>
                        <Button
                            onClick={() => {handleSubmit()}}
                            type="submit">Login
                        </Button>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}
