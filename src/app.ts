import express, {Request, Response} from 'express';
import {blogsRouter} from './routes/blogs-router';
import {postsRouter} from './routes/posts-router';
import {testRouter} from './routes/testing-router';
import {usersRouter} from './routes/users-router';
import {authRouter} from './routes/auth-router';
import {commentsRouter} from './routes/comments-router';
import {emailRouter} from './routes/email-router';
import cookieParser from "cookie-parser";
import {deviceRouter} from "./routes/device-router";

export const app = express();


const parserMiddleWare = express.json()
app.use(parserMiddleWare)
app.use(cookieParser())
app.set('trust proxy', true)


app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
app.use('/email', emailRouter);
app.use('/security/devices', deviceRouter);
app.use('/testing/all-data', testRouter);

app.use('/', (req: Request, res: Response) => {
    res.send('Siiiiii')
})

// cronJob (scheduler) => delete old connections in array
