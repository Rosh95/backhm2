import {Request, Response, Router} from 'express';
import {userService} from '../domain/users-service';


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        await userService.checkCredential(req.body.loginOrEmail, req.body.password);
        res.sendStatus(200)
    }
)