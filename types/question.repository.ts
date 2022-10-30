import { AddAnswerResponse, AddQuestionResponse } from './question.responses';
import { AddQuestionDto, AnswerDto } from './dto';
import { Answer } from './answer.interface';
import { Question } from './question.interface';

export interface QuestionRepositoryInterface {
   getQuestions: () => Promise<Question[]>;
   getQuestionById: (questionId: string) => Promise<Question | null>;
   addQuestion: (question: AddQuestionDto) => Promise<AddQuestionResponse>;
   getAnswers: (questionId: string) => Promise<Answer[]>;
   getAnswer: (questionId: string, answerId: string) => Promise<Answer | null>;
   addAnswer: (questionId: string, answer: AnswerDto) => Promise<AddAnswerResponse>;
}
