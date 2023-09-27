import {Request, Response, Router} from 'express';
import {userService} from '../domain/users-service';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, UserInputType, UserViewModel} from '../types/user-types';
import {authValidationMiddleware, isEmailConfirmatedMiddleware} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";


export const authRouter = Router({})

authRouter.post('/login',
    //   authValidationMiddleware,
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
    //  checkExistUserMiddleware,
    userValidation,
    errorsValidationMiddleware,
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

authRouter.post('/registration-confirmation',
    isEmailConfirmatedMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const code = req.body.code;

        const result = await authService.confirmEmail(code);


        if (result) {
            res.sendStatus(204)

        } else {
            res.sendStatus(400)
        }
    }
)

authRouter.post('/registration-email-resending',
    emailUserMiddleware,
    isEmailConfirmatedMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const email = req.body.email;

        const currentUser = await userService.findUserByEmail(email);

        if (currentUser) {
            try {
                await emailAdapter.sendConfirmationEmail(currentUser.emailConfirmation.confirmationCode, email)
            } catch (e) {
                return null
            }
            res.sendStatus(204)
        }
        return res.sendStatus(400)
    }
)