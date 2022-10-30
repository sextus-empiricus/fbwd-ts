import { Answer } from '../answer.interface';

export type AnswerDto = Omit<Answer, 'id'>;
