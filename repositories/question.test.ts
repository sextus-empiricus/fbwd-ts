import { rm, writeFile } from 'fs/promises';
import { makeQuestionRepository } from './question';
import { QuestionRepositoryInterface } from '../types';

describe('question repository', () => {
   const TEST_QUESTIONS_FILE_PATH = 'test-questions.json';
   const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
   let questionRepo: QuestionRepositoryInterface;

   const questionsMock = [
      {
         id: 'a35f5fe8-f4c8-4cc3-8058-07d9a1f29add',
         summary: 'What is my name?',
         author: 'Jack London',
         answers: [
            {
               id: '613d88d0-b458-4d8d-9922-6b48fd23ea76',
               author: 'Brian McKenzie',
               summary: 'The Earth is flat.',
            },
         ],
      },
      {
         id: 'ffb393f0-2cca-40b1-b544-76b4f8a5cc6e',
         summary: 'Who are you?',
         author: 'Tim Doods',
         answers: [],
      },
   ];

   const initQuestionsMock = async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(questionsMock));
   };

   beforeAll(async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]));

      questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH);
   });

   afterAll(async () => {
      await rm(TEST_QUESTIONS_FILE_PATH);
   });

   it('questionRepo should be defined', () => {
      expect(questionRepo).toBeDefined();
   });

   describe('getQuestions', () => {
      it('should return an empty array', async () => {
         expect(await questionRepo.getQuestions()).toHaveLength(0);
      });

      it('should return an array of 2 questions', async () => {
         await initQuestionsMock(); // <-- init for all next tests
         expect(await questionRepo.getQuestions()).toHaveLength(2);
      });

      it('should return a proper data structure', async () => {
         const questions = await questionRepo.getQuestions();
         expect(questions[0]).toStrictEqual({
            id: expect.stringMatching(v4),
            summary: expect.any(String),
            author: expect.any(String),
            answers: expect.any(Array),
         });
      });
   });
   describe('getQuestionById', () => {
      it('should return a targeted question', async () => {
         const { id } = questionsMock[0];
         expect(await questionRepo.getQuestionById(id)).toStrictEqual(questionsMock[0]);
      });
      it('not found - should return a null', async () => {
         expect(await questionRepo.getQuestionById('test1234')).toStrictEqual(null);
      });
   });
   describe('addQuestion', () => {
      const questionDtoMock = {
         summary: 'Who am I?',
         author: 'John Brown',
      };
      let newQuestionId: string;

      it('should return a created question id', async () => {
         const { createdQuestionId } = await questionRepo.addQuestion(questionDtoMock);
         newQuestionId = createdQuestionId;
         expect(createdQuestionId).toMatch(v4);
      });

      it('should attach generated uuid to dto and return a proper data structure', async () => {
         const newQuestion = await questionRepo.getQuestionById(newQuestionId);
         expect(newQuestion).toStrictEqual({
            id: expect.stringMatching(v4),
            summary: expect.any(String),
            author: expect.any(String),
            answers: expect.any(Array),
         });
      });

      it('should extend an questions array with added question', async () => {
         expect(await questionRepo.getQuestions()).toHaveLength(3);
      });
   });
   describe('getAnswers', () => {
      it('should return an empty array', async () => {
         const { id } = questionsMock[1];
         expect(await questionRepo.getAnswers(id)).toHaveLength(0);
      });

      it('should return an array of 1 answer', async () => {
         const { id } = questionsMock[0];
         expect(await questionRepo.getAnswers(id)).toHaveLength(1);
      });

      it('should return a proper data structure', async () => {
         const { id } = questionsMock[0];
         expect(await questionRepo.getAnswers(id)).toStrictEqual([
            {
               id: expect.stringMatching(v4),
               summary: expect.any(String),
               author: expect.any(String),
            },
         ]);
      });
   });
   describe('getAnswer', () => {
      const { id: questionId } = questionsMock[0];
      const { id: answerId } = questionsMock[0].answers[0];
      it('should return a targeted answer', async () => {
         expect(await questionRepo.getAnswer(questionId, answerId)).toStrictEqual({
            id: expect.stringMatching(v4),
            summary: expect.any(String),
            author: expect.any(String),
         });
      });
      it('incorrect question id - should return null', async () => {
         expect(await questionRepo.getAnswer('incorrectId', answerId)).toStrictEqual(null);
      });
      it('not found - should return a null', async () => {
         const { id } = questionsMock[0];
         expect(await questionRepo.getAnswer(id, 'test1234')).toStrictEqual(null);
      });
   });
   describe('addAnswer', () => {
      const { id: questionId } = questionsMock[0];
      let newAnswerId: string;
      const answerDtoMock = {
         summary: 'Some cleaver answer.',
         author: 'John Brown',
      };
      it('should return a proper response object', async () => {
         const responseObj = await questionRepo.addAnswer(questionId, answerDtoMock);
         newAnswerId = responseObj.createdAnswerId;
         expect(responseObj).toStrictEqual({
            updatedQuestionId: expect.stringMatching(v4),
            createdAnswerId: expect.stringMatching(v4),
         });
      });
      it('incorrect question id - should return a proper response object', async () => {
         const responseObj = await questionRepo.addAnswer('incorrectId', answerDtoMock);
         expect(responseObj).toStrictEqual({
            updatedQuestionId: expect.stringMatching('not found'),
            createdAnswerId: expect.any(String),
         });
      });
      it('should attach generated uuid to dto and return a proper data structure', async () => {
         const newAnswer = await questionRepo.getAnswer(questionId, newAnswerId);
         expect(newAnswer).toStrictEqual({
            id: expect.stringMatching(v4),
            summary: expect.any(String),
            author: expect.any(String),
         });
      });

      it('should extend an questions array with new answer attached no proper question', async () => {
         const targetQuestion = await questionRepo.getQuestionById(questionId);
         expect(targetQuestion.answers).toHaveLength(2);
      });
   });
});
