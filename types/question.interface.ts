import { Answer } from './answer.interface';

export interface Question {
   id: string;
   author: string;
   summary: string;
   answers: Answer[];
}
