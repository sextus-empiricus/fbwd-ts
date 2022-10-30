import { Response } from 'express';
import { RequestExtended } from '../types';

class QuestionController {
   static async getQuestions(req: RequestExtended, res: Response): Promise<void> {
      const questions = await req.repositories.questionRepo.getQuestions();
      res.status(200).json(questions);
   }

   static async getQuestionById(req: RequestExtended, res: Response): Promise<void> {
      const { questionId } = req.params;
      const targetedQuestion = await req.repositories.questionRepo.getQuestionById(questionId);
      res.status(200).json(targetedQuestion);
   }

   static async addQuestion(req: RequestExtended, res: Response): Promise<void> {
      const { body: newQuestion } = req;
      const responseObj = await req.repositories.questionRepo.addQuestion(newQuestion);
      res.status(201).json(responseObj);
   }

   static async getAnswers(req: RequestExtended, res: Response): Promise<void> {
      const { questionId } = req.params;
      const answers = await req.repositories.questionRepo.getAnswers(questionId);
      res.status(200).json(answers);
   }

   static async addAnswer(req: RequestExtended, res: Response): Promise<void> {
      const { questionId } = req.params;
      const { body: newAnswer } = req;
      const responseObj = await req.repositories.questionRepo.addAnswer(questionId, newAnswer);
      res.status(201).json(responseObj);
   }

   static async getAnswer(req: RequestExtended, res: Response): Promise<void> {
      const { questionId, answerId } = req.params;
      const answer = await req.repositories.questionRepo.getAnswer(questionId, answerId);
      res.status(200).json(answer);
   }
}

export { QuestionController };
