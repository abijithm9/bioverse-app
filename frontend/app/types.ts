export type LoginSuccessResponse = {
    success: boolean,
    id: number,
    name: string,
    email: string,
    role: string
}

export type User = {
    id: number,
    email: string,
    password?: number,
    role: string,
    name: string,
}

export type LoginErrorResponse = {
    success: false,
    message: string
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse

export enum QuestionType {
    mcq = "mcq",
    input = "input"
}

export type InputQuestion = {
    type: QuestionType.input,
    question: string
}

export type MultipleChoiceQuestion = {
    type: QuestionType.mcq,
    options: string[]
    question: string
}

export type Question = {
    question_id: number,
    question: InputQuestion | MultipleChoiceQuestion
}

export type Questionnaire = {
    id: number,
    name: string,
}

export type QuestionnaireWithQuestions = Questionnaire & {
    questions: Question[]
}

export type UserAnswer = {
    id: number,
    user_id: number,
    user_email: string,
    questionnaire_id: number,
    question_id: number,
    question_type: QuestionType,
    answer: string

}

export type UserAnswerWithQuestion = UserAnswer & {
    question: InputQuestion | MultipleChoiceQuestion
}