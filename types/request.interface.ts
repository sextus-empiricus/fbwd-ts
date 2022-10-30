import { Request } from 'express';
import { QuestionRepositoryInterface } from './question.repository';

export interface RequestExtended extends Request {
   repositories?: {
      questionRepo: QuestionRepositoryInterface;
   };
}
