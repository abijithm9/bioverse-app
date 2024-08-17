'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


interface Questionnaire {
    id: number;
    name: string;
}

function Questionnaires() {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const res = await axios.get('http://localhost:3001/api/questionnaires');
            setQuestionnaires(res.data.questionnaires);
        };
        fetchQuestionnaires();
    }, []);

    const handleSelect = (id: number) => {
        router.push(`/user/questionnaire/${id}`);
    };

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>
                <h1><strong>Select a Questionnaire</strong></h1>
                {questionnaires.map(q => (
                    <Card key={q.id} className="mb-4">
                        <CardHeader>
                            <CardTitle>{q.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Click below to start the questionnaire.</p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleSelect(q.id)}>Start</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Questionnaires