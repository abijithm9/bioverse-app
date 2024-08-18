'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { useParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import { Question, UserAnswer, UserAnswerWithQuestion } from '@/app/types';
import QuestionBox from '@/components/ui/question-box';

function Questionnaire() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number,UserAnswerWithQuestion>>({} as UserAnswer)

    const { getUser } = useUser();
    const user = getUser();
    const router = useRouter();
    const { id } = useParams();
 
    useEffect(() => {
        if (!id) return;
        const fetchQuestions = async () => {
            const res = await axios.get(`http://localhost:3001/api/questionnaire/${id}/questions`)
            setQuestions(res.data.questions)
        }
        fetchQuestions()
    }, [id])

    // check user's previous answers to pre-fill them and disable if completed
    useEffect(() => {
        if (!user.id) return;
        const fetchPrevAnswers = async () => {

            const res = await axios.get(`http://localhost:3001/api/user/${user.id}/answers`)
            const existingUserAnswers = res.data.userAnswers
            const currUserAnswers: Record<number, UserAnswerWithQuestion> = {}
            questions.forEach((question: Question) => {

                const existingAnswer = existingUserAnswers?.find(answer => answer.question_id === question.question_id);

                if (existingAnswer) {
                    currUserAnswers[question.question_id] = {
                        ...existingAnswer,
                        question: JSON.parse(question.question),

                    }
                } else {
                    currUserAnswers[question.question_id] = {
                        question: JSON.parse(question.question),
                        question_id: question.question_id,
                        user_id: user.id,
                        user_email: user.email,
                        questionnaire_id: Number(id),
                        question_type: JSON.parse(question.question).type,
                        answer: "",

                    } as UserAnswerWithQuestion;
                };
            });
            setUserAnswers(currUserAnswers)
        }
        fetchPrevAnswers()
    }, [user?.id, questions])

    async function handleSubmit() {
        try {


            const response = await axios.post('http://localhost:3001/api/submit-questionnaire', {
                userId: user.id,
                userEmail: user.email, 
                questionnaireId: Number(id), 
                answers: Object.keys(userAnswers).map((questionId: any) => ({
                    question_id: Number(questionId),
                    answer: userAnswers[Number(questionId)].answer,
                    question_type: userAnswers[Number(questionId)].question_type
                }))
            });
            if (response.data.success) {
                alert('Questionnaire submitted successfully!');
                router.push('/user/questionnaire')
            } else {
                alert('Failed to submit questionnaire.');
            }
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            alert('Error submitting questionnaire.');
        }
    }



    return (
        <div>
             <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            
                <Carousel className=" h-[60vh] w-[40%] max-w-3xl mx-auto max-h-[60vh]" opts={{ align: "start", slidesToScroll: 1 }}>
                    <CarouselContent >
                       {Object.keys(userAnswers).map((questionId: any) => (
                            <QuestionBox key={questionId} question={userAnswers[questionId]} setAnswer={(answer: string) => setUserAnswers(prevAnswers => ({
                                ...prevAnswers,
                                [questionId]: { ...prevAnswers[questionId], answer }
                            }))} />
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
       

        </div>
       
 
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <Button
                        className="bg-gray-500 hover:bg-black-600 text-white font-bold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={handleSubmit}
                    >
                        Submit Questionnaire
                    </Button>
                </div>
            </div> 
    
    );
}

export default Questionnaire