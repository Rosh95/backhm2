import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {userService} from '../domain/users-service';
import {commentQueryRepository} from "../repositories/comment/comment-query-repository";
import {userRepository} from "../repositories/user/user-repository";
import {body} from "express-validator";
import jwt from "jsonwebtoken";
import {settings} from "../settings";
import {devicesCollection} from "../db/dbMongo";


export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByAccessToken(token.toString());
    const commentUser = await commentQueryRepository.getCommentById(req.params.commentId);

    if (userId) {
        let isCorrectUser = userId.toString() !== commentUser?.commentatorInfo.userId.toString();
        if (commentUser && isCorrectUser) {
            return res.sendStatus(403)
        }

        req.user = await userService.findUserById(userId.toString())
        next();
        return
    }
    return res.sendStatus(401);
}
export const authValidationINfoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByAccessToken(token.toString());
    if (userId) {

        req.user = await userService.findUserById(userId.toString())
        next();
        return
    }
    return res.sendStatus(401);
}

export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401)
        return;
    }
    try {
        const result = await jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET) as {
            userId: string,
            deviceId: string,
            exp: number,
            iat: number
        };
        const findUserTokenInfo = await devicesCollection.findOne({userId: result.userId, deviceId: result.deviceId})
        if (findUserTokenInfo && result.iat === findUserTokenInfo.issuedAt && result.exp === findUserTokenInfo.expirationAt) {
            console.log(result);
            next()
            return
        }
        return res.sendStatus(401)
    } catch (e) {
        return res.sendStatus(401)

    }
}


export const checkAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401)
        return;
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const result = await jwt.verify(accessToken, settings.JWT_SECRET) as {
            userId: string,
            exp: number,
            iat: number
        };
        if (result.userId && result.exp * 1000 > Date.now()) {
            next()
            return
        }
        return res.sendStatus(401)
    } catch (e) {
        return res.sendStatus(401)

    }
}

export const checkExistUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let foundUser = await userService.findUserByLogin(req.body.login);

    if (!foundUser) {
        next();
        return
    }
    return res.sendStatus(400);
}

// export const checkEmailConfirmationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     let foundUser = await deviceRepository.findUserByCode(req.body.code);
//
//     if (foundUser && foundUser.emailConfirmation.isConfirmed === false) {
//         next();
//         return;
//     }
//     return res.sendStatus(400);
// }

export const isEmailConfirmatedMiddlewareByCode = body('code').custom(async (value) => {
    let foundUser = await userRepository.findUserByCode(value);

    if (foundUser!.emailConfirmation.isConfirmed) {

        throw new Error('This email has confirmed.')
    }

    return true;

}).withMessage('This email has confirmed');
export const isEmailConfirmatedMiddlewareByEmail = body('email').custom(async (value) => {
    let foundUser = await userRepository.findUserByEmail(value);

    if (foundUser!.emailConfirmation.isConfirmed) {
        console.log(foundUser)
        throw new Error('This email has confirmed.')
    }

    return true;

}).withMessage('This email has confired or we couldn`t find user');