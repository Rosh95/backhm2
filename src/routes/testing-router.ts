import {Request, Response, Router} from 'express';
import {db} from '../db/db';

export const testRouter = Router({})

testRouter.delete('/', (req: Request, res: Response) => {
    if (db.blogs.length > 0) {
        db.blogs.splice(0)
        res.sendStatus(204)
    }
    if (db.posts.length > 0) {
        db.posts.splice(0)
        res.sendStatus(204)
    }
    return;
})