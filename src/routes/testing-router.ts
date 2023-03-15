import {Request, Response, Router} from 'express';
import {videoData} from '../videosData';

export const testRouter = Router({})

testRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    if (videoData.length > 0) {
        videoData.splice(0)
        res.sendStatus(204)
        return;
    }
})