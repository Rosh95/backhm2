import {Request, Response, Router} from 'express';
import {db} from '../db/db';
import {blogsCollection, postsCollection} from '../db/dbMongo';

export const testRouter = Router({})

testRouter.delete('/', async (req: Request, res: Response) => {
    // if (db.blogs.length > 0) {
    //     db.blogs.splice(0)
    // }
    // if (db.posts.length > 0) {
    //     db.posts.splice(0)
    // }

    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({})
    res.sendStatus(204)

})