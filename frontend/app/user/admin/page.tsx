'use client'
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';

import UserAnswers from '@/components/ui/userAnswers';
import { User } from '@/app/types';

function Admin() {
    const [users, setUsers] = useState<User[]>([])
    const router = useRouter()
    const { getUser } = useUser()

    useEffect(() => {
       const user = getUser()
        if (!user) {
            router.push('/user')
        }
    }, [getUser, router])

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('https://bioverse-backend-f40e702ba4ff.herokuapp.com/api/admin/users')
            setUsers(res.data.users);
        }
        fetchUsers()
    }, [])

    return (
        <div style={{ padding: '50px' }}>
            <h2>Admin Panel</h2>
                {users.map((user, index) => (
                    <UserAnswers user={user} key={user.email} />
                ))}

        </div>
    );
}

export default Admin
