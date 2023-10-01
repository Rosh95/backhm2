import {Request, Response, Router} from 'express';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, getUserViewModel, UserInputType, UserViewModel} from '../types/user-types';
import {
    authValidationMiddleware, checkAccessTokenMiddleware, checkRefreshTokenMiddleware,
    isEmailConfirmatedMiddlewareByCode,
    isEmailConfirmatedMiddlewareByEmail,
} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";
import {userRepository} from "../repositories/user/user-repository";
import {userService} from "../domain/users-service";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {

        let user = await authService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const token = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user)
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.header('accessToken', token.accessToken)
            return res.status(200).send(token)
        } else {
            return res.sendStatus(401)
        }
    }
)
authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware,
    checkAccessTokenMiddleware,
    async (req: Request, res: Response) => {

        //   const refreshToken = req.cookies.refreshToken;
        const accessToken = req.headers.authorization!.split(' ')[1];
        const currentUserId = await jwtService.getUserIdByToken(accessToken.toString());
        const currentUser = currentUserId ? await userService.findUserById(currentUserId.toString()) : null;
        if (currentUser) {
            const newAccesstoken = await jwtService.createJWT(currentUser)
            const newRefreshToken = await jwtService.createRefreshJWT(currentUser)
            res.clearCookie('refreshToken');
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            res.setHeader('accessToken', newAccesstoken.accessToken)
            return res.status(200).send(newAccesstoken)
        } else {
            return res.sendStatus(401)
        }
    }
)

authRouter.post('/logout',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        res.clearCookie('refreshToken');
        return res.sendStatus(200)
    }
)


authRouter.get('/me',
    checkAccessTokenMiddleware,
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
        const newUser: getUserViewModel | null = await authService.createUser(userPostInputData);
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