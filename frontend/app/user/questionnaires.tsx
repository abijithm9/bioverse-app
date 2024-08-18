import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Questionnaire {
    id: number;
    name: string;
}

function Questionnaires() {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestionnaires = async () => {
            const res = await axios.get('https://bioverse-backend-f40e702ba4ff.herokuapp.com/api/questionnaires');
            setQuestionnaires(res.data.questionnaires);
        };
        fetchQuestionnaires();
    }, []);

    const handleSelect = (id: number) => {
        router.push(`/questionnaire/${id}`);
    };

    return (
        <div style={{ padding: '50px' }}>
            <h2>Select a Questionnaire</h2>
            <ul>
                {questionnaires.map(q => (
                    <li key={q.id}>
                        <h3>{q.name}</h3>
                        <button onClick={() => handleSelect(q.id)}>Start</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Questionnaires