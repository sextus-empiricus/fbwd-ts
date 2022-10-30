import { readFile, writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import { CustomException } from '../exceptions/custom.exception';
import {
   AddAnswerResponse,
   AddQuestionDto,
   AddQuestionResponse,
   Answer,
   AnswerDto,
   Question,
   QuestionRepositoryInterface,
} from '../types';

const makeQuestionRepository = (fileName: string): QuestionRepositoryInterface => {
   const getQuestions = async (): Promise<Question[]> => {
      return await loadQuestions();
   };

   const getQuestionById = async (questionId: string): Promise<Question | null> => {
      return findQuestionById(await loadQuestions(), questionId) ?? null;
   };

   const addQuestion = async (question: AddQuestionDto): Promise<AddQuestionResponse> => {
      const newQuestion = { ...question, id: uuid(), answers: question.answers ?? [] };
      const questionsUpdated = [...(await loadQuestions()), newQuestion];
      await updateQuestions(questionsUpdated);
      return { createdQuestionId: newQuestion.id };
   };

   const getAnswers = async (questionId: string): Promise<Answer[]> => {
      const targetedQuestion = findQuestionById(await loadQuestions(), questionId);
      return targetedQuestion?.answers ?? [];
   };

   const getAnswer = async (questionId: string, answerId: string): Promise<Answer | null> => {
      const targetedQuestion = findQuestionById(await loadQuestions(), questionId);
      if (!targetedQuestion) throw new CustomException('Provided id not match any question', 409);
      return findAnswerById(targetedQuestion.answers, answerId) ?? null;
   };

   const addAnswer = async (questionId: string, answer: AnswerDto): Promise<AddAnswerResponse> => {
      const questions = await loadQuestions();
      const targetedQuestion = findQuestionById(questions, questionId);
      if (!targetedQuestion) throw new CustomException('Provided id not match any question', 409);
      const newAnswer = { ...answer, id: uuid() };
      targetedQuestion.answers.push(newAnswer);
      const questionsUpdated = [
         ...questions.filter((el: Question) => el.id !== questionId),
         targetedQuestion,
      ];
      await updateQuestions(questionsUpdated);
      return {
         updatedQuestionId: targetedQuestion.id,
         createdAnswerId: newAnswer.id,
      };
   };

   //utility fns:
   const loadQuestions = async (): Promise<Question[]> => {
      const fileContent = await readFile(fileName, { encoding: 'utf-8' });
      return JSON.parse(fileContent);
   };
   const updateQuestions = async (array: Question[]): Promise<void> => {
      await writeFile(fileName, JSON.stringify(array), { encoding: 'utf-8' });
   };
   const findQuestionById = (array: Question[], id: string): Question => {
      return array.filter((el) => el.id === id)[0];
   };
   const findAnswerById = (array: Answer[], id: string): Answer => {
      return array.filter((el) => el.id === id)[0];
   };

   return {
      getQuestions,
      getQuestionById,
      addQuestion,
      getAnswers,
      getAnswer,
      addAnswer,
   };
};

export { makeQuestionRepository };
