import {Request, Response, Router} from 'express';
import {jwtService} from '../application/jwt-service';
import {CurrentUserInfoType, getUserViewModel, UserInputType} from '../types/user-types';
import {v4 as uuidv4} from 'uuid';
import {
    authValidationINfoMiddleware,
    checkAccessTokenMiddleware,
    checkRefreshTokenMiddleware, countNumberLoginAttempts,
    isEmailConfirmatedMiddlewareByCode,
    isEmailConfirmatedMiddlewareByEmail,
} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";
import {userService} from "../domain/users-service";
import {deviceInputValue} from "../types/auth-types";
import {deviceRepository} from "../repositories/device/device-repository";

export const authRouter = Router({})

authRouter.post('/login',
    countNumberLoginAttempts,
    async (req: Request, res: Response) => {
        let user = await authService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const accessToken = await jwtService.createJWT(user)
            const deviceId = uuidv4();
            const refreshToken = await jwtService.createRefreshJWT(user, deviceId)
            const deviceInfo: deviceInputValue = {
                userId: user._id.toString(),
                deviceId: deviceId,
                refreshToken: refreshToken.refreshToken,
                deviceName: req.headers['user-agent'] ? req.headers['user-agent'].toString() : 'unknown',
                ip: req.ip
            }
            try {
                await authService.addDeviceInfoToDB(deviceInfo);
            } catch (e) {
                return false
            }
            res.cookie('refreshToken', refreshToken.refreshToken, {httpOnly: true, secure: true})
            res.header('accessToken', accessToken.accessToken)
            return res.status(200).send(accessToken)
        } else {
            return res.sendStatus(401)
        }
    }
)
authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) return res.sendStatus(401)
        const currentUserId: string = currentUserInfo.userId;
        const currentDeviceId: string = currentUserInfo.deviceId;
        const currentUser = currentUserId ? await userService.findUserById(currentUserId.toString()) : null;
        if (currentUser) {
            const newAccessToken = await jwtService.createJWT(currentUser)
            const newRefreshToken = await jwtService.createRefreshJWT(currentUser, currentDeviceId)
            const deviceInfo: deviceInputValue = {
                userId: currentUserId,
                deviceId: currentDeviceId,
                refreshToken: newRefreshToken.refreshToken,
                deviceName: req.headers['user-agent'] ? req.headers['user-agent'].toString() : 'unknown',
                ip: req.ip
            }
            try {
                await authService.addDeviceInfoToDB(deviceInfo);
            } catch (e) {
                return false
            }
            return res
                .cookie('refreshToken', newRefreshToken.refreshToken, {httpOnly: true, secure: true})
                .header('accessToken', newAccessToken.accessToken)
                .status(200).send(newAccessToken)
        }
        return res.sendStatus(401)
    }
)

authRouter.post('/logout',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        //убрать лишнюю инфу в базе данных ( обнулить дату создания )
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) return res.sendStatus(401)
        const currentUserId: string = currentUserInfo.userId;
        const currentDeviceId: string = currentUserInfo.deviceId;
        await deviceRepository.updateIssuedDate(currentUserId, currentDeviceId);
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
    countNumberLoginAttempts,
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
            return res.sendStatus(204)

        }
        return res.sendStatus(400)

    }
)

authRouter.post('/registration-confirmation',
    countNumberLoginAttempts,
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
    countNumberLoginAttempts,
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
authRouter.post('/password-recovery',
    countNumberLoginAttempts,
    emailUserMiddleware,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const email = req.body.email;
        const currentUser = await authService.changeUserConfirmationcode(email);
        if (currentUser) {
            try {
                await emailAdapter.sendRecoveryPasswordEmail(currentUser.emailConfirmation.confirmationCode, email)
            } catch (e) {
                return null
            }
            return res.sendStatus(204)
        }
        return res.sendStatus(400)
    }
)
authRouter.post('/new-password',
    countNumberLoginAttempts,
    isEmailConfirmatedMiddlewareByCode,
    errorsValidationMiddleware,
    async (req: Request, res: Response) => {
        const code = req.body.recoveryCode;
        const newPassword = req.body.newPassword;
        const result = await authService.сonfirmAndChangePassword(code, newPassword);
        if (result) {
            return res.sendStatus(204)
        }
        return res.sendStatus(400)
    }
)
