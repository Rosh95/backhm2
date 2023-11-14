import {Request, Response, Router} from 'express';
import {jwtService, JwtService} from '../application/jwt-service';
import {CurrentUserInfoType, getUserViewModel, UserInputType} from '../types/user-types';
import {v4 as uuidv4} from 'uuid';
import {
    authValidationINfoMiddleware,
    checkAccessTokenMiddleware,
    checkNewPassword,
    checkRefreshTokenMiddleware,
    countNumberLoginAttempts,
    isEmailConfirmatedMiddlewareByCode,
    isEmailConfirmatedMiddlewareByEmail, isValidRecoveryCode,
} from '../validation/auth-validation-middleware';
import {emailUserMiddleware, userValidation} from '../validation/users-validation';
import {errorsValidationMiddleware} from '../validation/error-validation-middleware';
import {emailAdapter} from "../adapters/email-adapter";
import {authService, AuthService} from "../domain/auth-service";
import {userService} from "../domain/users-service";
import {deviceInputValue} from "../types/auth-types";
import {deviceRepository, DeviceRepository} from "../repositories/device/device-repository";

export const authRouter = Router({})

export class AuthController {
    constructor(
        public authService: AuthService,
        public jwtService: JwtService,
        public deviceRepository: DeviceRepository,
    ) {
    }

    async loginUser(req: Request, res: Response) {
        let user = await this.authService.checkCredential(req.body.loginOrEmail, req.body.password);
        if (user) {
            const accessToken = await this.jwtService.createJWT(user)
            const deviceId = uuidv4();
            const refreshToken = await this.jwtService.createRefreshJWT(user, deviceId)
            const deviceInfo: deviceInputValue = {
                userId: user._id.toString(),
                deviceId: deviceId,
                refreshToken: refreshToken.refreshToken,
                deviceName: req.headers['user-agent'] ? req.headers['user-agent'].toString() : 'unknown',
                ip: req.ip
            }
            try {
                await this.authService.addDeviceInfoToDB(deviceInfo);
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

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await this.jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) return res.sendStatus(401)
        const currentUserId: string = currentUserInfo.userId;
        const currentDeviceId: string = currentUserInfo.deviceId;
        const currentUser = currentUserId ? await userService.findUserById(currentUserId.toString()) : null;
        if (currentUser) {
            const newAccessToken = await this.jwtService.createJWT(currentUser)
            const newRefreshToken = await this.jwtService.createRefreshJWT(currentUser, currentDeviceId)
            const deviceInfo: deviceInputValue = {
                userId: currentUserId,
                deviceId: currentDeviceId,
                refreshToken: newRefreshToken.refreshToken,
                deviceName: req.headers['user-agent'] ? req.headers['user-agent'].toString() : 'unknown',
                ip: req.ip
            }
            try {
                await this.authService.addDeviceInfoToDB(deviceInfo);
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

    async logoutUser(req: Request, res: Response) {
        //убрать лишнюю инфу в базе данных ( обнулить дату создания )
        const refreshToken = req.cookies.refreshToken;
        const currentUserInfo = await this.jwtService.getTokenInfoByRefreshToken(refreshToken);
        if (!currentUserInfo) return res.sendStatus(401)
        const currentUserId: string = currentUserInfo.userId;
        const currentDeviceId: string = currentUserInfo.deviceId;
        await this.deviceRepository.updateIssuedDate(currentUserId, currentDeviceId);
        return res
            .clearCookie('refreshToken')
            .sendStatus(204)
    }

    async getInfoOfCurrentUser(req: Request, res: Response) {
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

    async registrationUser(req: Request, res: Response) {

        let userPostInputData: UserInputType = {
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        }
        const newUser: getUserViewModel | null = await this.authService.createUser(userPostInputData);
        if (newUser) {
            return res.sendStatus(204)

        }
        return res.sendStatus(400)

    }

    async registrationConfirmation(req: Request, res: Response) {
        const code = req.body.code;
        const result = await this.authService.confirmEmail(code);
        if (result) {
            return res.sendStatus(204)
        }
        return res.sendStatus(400)
    }

    async registrationEmailResending(req: Request, res: Response) {

        const email = req.body.email;

        const currentUser = await this.authService.changeUserConfirmationcode(email);
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

    async passwordRecovery(req: Request, res: Response) {
        const email = req.body.email;
        // let foundUserByEmail = await userService.findUserByEmail(email)
        // if (!foundUserByEmail) return res.sendStatus(400)
        const recoveryCode = uuidv4()
        await this.authService.addRecoveryCodeAndEmail(email, recoveryCode);
        try {
            await emailAdapter.sendRecoveryPasswordEmail(recoveryCode, email)
            return res.sendStatus(204)
        } catch (e) {
            return null
        }
    }

    async getNewPassword(req: Request, res: Response) {
        const recoveryCode = req.body.recoveryCode;
        const newPassword = req.body.newPassword;

        const result = await this.authService.сonfirmAndChangePassword(recoveryCode, newPassword);
        if (result) {
            return res.sendStatus(204)
        }
        return res.sendStatus(400)
    }


}

export const authController = new AuthController(authService, jwtService, deviceRepository)


authRouter.post('/login',
    countNumberLoginAttempts, authController.loginUser.bind(authController))
authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware, authController.refreshToken.bind(authController))

authRouter.post('/logout',
    checkRefreshTokenMiddleware, authController.logoutUser.bind(authController))


authRouter.get('/me',
    authValidationINfoMiddleware,
    checkAccessTokenMiddleware, authController.getInfoOfCurrentUser.bind(authController))

authRouter.post('/registration',
    countNumberLoginAttempts,
    userValidation,
    errorsValidationMiddleware, authController.registrationUser.bind(authController))

authRouter.post('/registration-confirmation',
    countNumberLoginAttempts,
    isEmailConfirmatedMiddlewareByCode,
    errorsValidationMiddleware, authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    countNumberLoginAttempts,
    emailUserMiddleware,
    isEmailConfirmatedMiddlewareByEmail,
    errorsValidationMiddleware, authController.registrationEmailResending.bind(authController))
authRouter.post('/password-recovery',
    countNumberLoginAttempts,
    emailUserMiddleware,
    // checkRegistredUserByEmail,
    errorsValidationMiddleware, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password',
    countNumberLoginAttempts,
    checkNewPassword,
    isValidRecoveryCode,
    errorsValidationMiddleware, authController.getNewPassword.bind(authController))
