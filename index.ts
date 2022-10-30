import express, { Response } from 'express';
import { json, urlencoded } from 'body-parser';
import { makeRepositories } from './middleware/repositories';
import { questionRouter } from './routes/question.router';
import { RequestExtended } from './types';

const STORAGE_FILE_PATH = 'questions.json';
const PORT = 3000;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(makeRepositories(STORAGE_FILE_PATH));

app.get('/', (_: RequestExtended, res: Response) => {
   res.json({ message: 'Welcome to responder!' });
});

app.use('/questions', questionRouter);

app.listen(PORT, () => {
   console.log(`Responder app listening on port ${PORT}`);
});
