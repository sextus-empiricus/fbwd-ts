import { Answer } from '../answer.interface';

export interface AddQuestionDto {
   author: string;
   summary: string;
   answers?: Answer[];
}
