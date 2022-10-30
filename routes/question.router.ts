import express from 'express';
import { QuestionController } from '../controllers/question.controller';

const questionRouter = express.Router();

questionRouter
   .post('/', QuestionController.addQuestion)
   .get('/', QuestionController.getQuestions)
   .get('/:questionId', QuestionController.getQuestionById)

   .post('/:questionId/answers', QuestionController.addAnswer)
   .get('/:questionId/answers', QuestionController.getAnswers)
   .get('/:questionId/answers/:answerId', QuestionController.getAnswer);

export { questionRouter };
