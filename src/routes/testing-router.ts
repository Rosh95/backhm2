import {Request, Response, Router} from 'express';
import {blogsCollection, postsCollection} from '../db/dbMongo';

export const testRouter = Router({})

testRouter.delete('/', async (req: Request, res: Response) => {

    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({})
    res.sendStatus(204)

})