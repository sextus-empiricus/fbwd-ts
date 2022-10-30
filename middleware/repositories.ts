import { NextFunction, Response } from 'express';
import { makeQuestionRepository } from '../repositories/question';
import { RequestExtended } from '../types';

export const makeRepositories =
   (fileName: string) =>
   (req: RequestExtended, res: Response, next: NextFunction): void => {
      req.repositories = { questionRepo: makeQuestionRepository(fileName) };
      next();
   };
