import {Request, Response, Router} from 'express';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, getUserViewModel, UserInputType} from '../types/user-types';
import {
    authValidationINfoMiddleware,
    authValidationMiddleware,
    checkAccessTokenMiddleware,
    checkRefreshTokenMiddleware,
    isEmailConfirmatedMiddlewareByCode,
    isEmailConfirmatedMiddlewareByEmail,
} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";
import {userService} from "../domain/users-service";


export const authRouter = Router({})

const whiteList: { accessToken: string, refreshToken: string } = {
    accessToken: '',
    refreshToken: ''
}
authRouter.post('/login',
    async (req: Request, res: Response) => {

        let user = await authService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const token = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user)
            whiteList.accessToken = token.accessToken;
            whiteList.refreshToken = refreshToken.refreshToken
            res.cookie('refreshToken', refreshToken.refreshToken, {httpOnly: true, secure: true})
            res.header('accessToken', token.accessToken)
            return res.status(200).send(token)
        } else {
            return res.sendStatus(401)
        }
    }
)
authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken !== whiteList.refreshToken) {
            return res.status(401).send(
                {message: 'it isn`t valid refresh token'}
            )
        }

        const currentUserId = await jwtService.getUserIdByRefreshToken(refreshToken);
        const currentUser = currentUserId ? await userService.findUserById(currentUserId.toString()) : null;
        if (currentUser) {
            const newAccesstoken = await jwtService.createJWT(currentUser)
            const newRefreshToken = await jwtService.createRefreshJWT(currentUser)
            whiteList.accessToken = newAccesstoken.accessToken;
            whiteList.refreshToken = newRefreshToken.refreshToken
            return res
                .cookie('refreshToken', newRefreshToken.refreshToken, {httpOnly: true, secure: true})
                .header('accessToken', newAccesstoken.accessToken)
                .status(200).send(newAccesstoken)
        }
        return res.sendStatus(401)

    }
)

authRouter.post('/logout',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        whiteList.refreshToken = ''
        return res
            .clearCookie('refreshToken')
            .sendStatus(204)
    }
)


authRouter.get('/me',
    authValidationINfoMiddleware,
    checkAccessTokenMiddleware,
    async (req, res) => {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return;
        }
        const accessToken = req.headers.authorization.split(' ')[1];
        if (accessToken !== whiteList.accessToken) {
            return res.status(401).send(
                {message: 'it isn`t valid access token'}
            )
        }
        const currentUserInfo: CurrentUserInfoType = {
            login: req.user!.accountData.login,
            email: req.user!.accountData.email,
            userId: req.user!._id.toString()
        }
        if (req.user) {
            return res.status(200).send(currentUserInfo)
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

        }
        return res.sendStatus(400)

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