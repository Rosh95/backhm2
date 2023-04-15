import {Request, Response, Router} from 'express';
import {userService} from '../domain/users-service';
import {jwtService} from '../application/jwt-service';


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {

        let user = await userService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        } else {
            res.sendStatus(401)
        }
    }
)