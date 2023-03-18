import {testRouter} from './routes/testing-router';
import express, {Request, Response} from 'express';
import {blogsRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';

const port = process.env.port || 3001;
export const app = express();


const parserMiddleWare = express.json()
app.use(parserMiddleWare)


app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing/all-data', testRouter);

app.use('/', (req: Request, res: Response) => {
    res.send('Siiiiii')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})