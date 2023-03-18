import {Request, Response, Router} from 'express';
import {db} from '../db/db';

export const testRouter = Router({})

testRouter.delete('/', (req: Request, res: Response) => {
    console.log(db.blogs + ' before delete blogs')
    console.log(db.posts + ' before delete posts')
    if (db.blogs.length > 0) {
        db.blogs.splice(0)
        res.sendStatus(204)
    }
    console.log(db.blogs + ' after delete blogs')

    if (db.posts.length > 0) {
        db.posts.splice(0)
        res.sendStatus(204)
    }
    console.log(db.posts + ' after delete posts')


})