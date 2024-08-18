import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { User, UserAnswerWithQuestion } from '@/app/types';

type UserAnswersProps = {
    user: User
};

const UserAnswers = ({ user }: UserAnswersProps) => {
    const [answers, setAnswers] = useState<UserAnswerWithQuestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [questionString, setQuestionString] = useState<string | null>(null);

    const loadAnswers = useCallback(() => {
        setIsLoading(true);

        axios.get(`https://bioverse-backend-f40e702ba4ff.herokuapp.com/api/user/${user.id}/answers`)
            .then(res => {
                setAnswers(res.data.userAnswers);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch answers:', error);
                setIsLoading(false);
            });
    }, [user.id]);

    if (!user) return null;
    return (
        <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger
                        onClick={() => {
                            if (!answers) {
                                loadAnswers();
                            }
                        }}
                    
                    >User Email: {user.email}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4 border border-gray-300 rounded-md p-4">
                        {isLoading ? (
                            <p className="text-gray-500 italic">Loading answers...</p>
                        ) : answers === null ? (
                            <p className="text-red-500">Failed to load answers. Please try again.</p>
                        ) : answers.length === 0 ? (
                            <p className="text-gray-600">User has not answered any questions yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {answers.map((answer, index) =>{ 
                                    const question = JSON.parse(answer.question as any);
                                    const questionString = question.question;
                                    return (

                                    <li key={index} className="bg-gray-100 p-3 rounded-md">
                                        <span className="font-semibold">Question:</span> {questionString}
                                        <br />
                                        <span className="font-semibold">Answer:</span> {answer.answer}
                                    </li>
                                )
                            })}
                            </ul>
                        )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default UserAnswers;
