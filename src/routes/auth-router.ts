import {Request, Response, Router} from 'express';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, UserInputType, UserViewModel} from '../types/user-types';
import {
    authValidationMiddleware,
    isEmailConfirmatedMiddlewareByCode,
    isEmailConfirmatedMiddlewareByEmail,
} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {

        let user = await authService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const token = await jwtService.createJWT(user)
            return res.status(200).send(token)
        } else {
            return res.sendStatus(401)
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
        const newUser: UserViewModel | null = await authService.createUser(userPostInputData);
        if (newUser) {
            res.sendStatus(204)

        } else {
            res.sendStatus(400)
        }
    }
)

authRouter.post('/registration-confirmation',
    isEmailConfirmatedMiddlewareByCode,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const code = req.body.code;

        const result = await authService.confirmEmail(code);


        if (result) {
            return res.sendStatus(204)
        }
        return res.sendStatus(400)

    }
)

authRouter.post('/registration-email-resending',
    emailUserMiddleware,
    isEmailConfirmatedMiddlewareByEmail,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {

        const email = req.body.email;

        const currentUser = await authService.changeUserConfirmationcode(email);
        if (currentUser) {
            try {
                await emailAdapter.sendConfirmationEmail(currentUser.emailConfirmation.confirmationCode, email)
            } catch (e) {
                return null
            }
            return res.sendStatus(204)

        }
        return res.sendStatus(400)
    }
)