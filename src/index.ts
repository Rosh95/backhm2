import express, {Response, Request} from 'express'
import {blogsRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';
import {testRouter} from './routes/testing-router';

const app = express();

const port = process.env.port || 3001;

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