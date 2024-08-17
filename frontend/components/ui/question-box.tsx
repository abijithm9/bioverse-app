'use client'

import {FC, useState} from 'react'
import { User, UserAnswerWithQuestion, MultipleChoiceQuestion } from '@/app/types';
import { Card, CardContent } from "@/components/ui/card"
import { CarouselItem } from './carousel';
import {Checkbox} from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'


interface QuestionBoxProps {
    question: UserAnswerWithQuestion
    setAnswer: (answer: string) => void
}

const QuestionBox: FC<QuestionBoxProps> = ({ question, setAnswer }) => {
    // const [answer, setAnswer] = useState<string>(question.answer)

    return (
    
            <CarouselItem className="w-auto mx-30">
                <Card className="shadow-lg rounded-lg overflow-hidden ">
                    <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">{question.question.question}</h3>
                        {question.question_type === 'input' ? (
                            <textarea
                                className="w-full text-lg p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 min-h-[150px] resize-vertical"
                                placeholder="Type your answer here"
                                onChange={(e) => setAnswer(e.target.value)}
                                value={question.answer}
                            />
                        ) : (
                            <div className="space-y-4">
                                {(question.question as MultipleChoiceQuestion).options.map((option: string, idx: number) => (
                                    <div key={idx} className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition duration-200">
                                        <Checkbox
                                            id={`option-${idx}`}
                                            checked={question.answer.split(",").map(a => a.toLowerCase()).includes(option.toLowerCase())}
                                            onCheckedChange={(checked) => {
                                                const currentAnswers = question.answer ? question.answer.split(',').filter(Boolean).map(a => a.toLowerCase()) : [];
                                                if (checked) {
                                                    setAnswer(Array.from(new Set([...currentAnswers, option.toLowerCase()])).join(','));
                                                } else {
                                                    setAnswer(currentAnswers.filter(a => a !== option.toLowerCase()).join(','));
                                                }
                                            }}
                                            className="w-5 h-5"
                                        />
                                        <label
                                            htmlFor={`option-${idx}`}
                                            className="text-base font-medium leading-none cursor-pointer select-none"
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </CarouselItem>
        
  
    )
}

export default QuestionBox