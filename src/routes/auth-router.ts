import e, {Request, Response, Router} from 'express';
import {userService} from '../domain/users-service';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, UserInputType, UserViewModel} from '../types/user-types';
import {authValidationMiddleware} from '../validation/auth-validation-middleware';
import nodemailer from 'nodemailer';


export const authRouter = Router({})

authRouter.post('/login',
    authValidationMiddleware,
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
authRouter.get('/me',
    authValidationMiddleware,
    async (req, res) => {
        const currentUserInfo: CurrentUserInfoType = {
            login: req.user!.accountData.login,
            email: req.user!.accountData.email,
            userId: req.user!._id.toString()
        }
        if (req.user) {
            return res.send(currentUserInfo)
        }
        return res.sendStatus(404)
    }
)

authRouter.post('/registration',
    // checkExistUserMiddleware,
    // errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        let userPostInputData: UserInputType = {
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        }
        const newUser: UserViewModel | null = await userService.createUser(userPostInputData);
        if (newUser) {
            res.sendStatus(204)

        } else {
            res.sendStatus(400)
        }
    }
)