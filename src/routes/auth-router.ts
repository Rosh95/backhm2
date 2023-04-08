import {Request, Response, Router} from 'express';
import {userService} from '../domain/users-service';


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        let result = await userService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (result) {
            res.sendStatus(204)
        } else res.sendStatus(401)
    }
)