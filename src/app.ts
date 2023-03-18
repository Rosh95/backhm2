import express, {Request, Response} from 'express';
import {blogsRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';
import {testRouter} from './routes/testing-router';

export const app = express();


const parserMiddleWare = express.json()
app.use(parserMiddleWare)


app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/', (req: Request, res: Response) => {
    res.send('Siiiiii')
})