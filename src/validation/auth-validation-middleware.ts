import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {userService} from '../domain/users-service';
import {commentQueryRepository} from "../repositories/comment/comment-query-repository";
import {userRepository} from "../repositories/user/user-repository";
import {body} from "express-validator";
import jwt, {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import {settings} from "../settings";


export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token.toString());
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
export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.accessToken;
    if (!refreshToken) {
        res.send(401)
        return;
    }

    jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET, (err: any, decoded: any) => {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send({success: false, message: 'Unauthorized! Access Token was expired!'});
        }
        if (err instanceof NotBeforeError) {
            return res.status(401).send({success: false, message: 'jwt not active'});
        }
        if (err instanceof JsonWebTokenError) {
            return res.status(401).send({success: false, message: 'jwt malformed'});
        }
        return
    })

    next()
    return

}
export const checkAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const accessToken = req.headers.authorization.split(' ')[1];


    jwt.verify(accessToken, settings.JWT_SECRET, (err: any, decoded: any) => {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send({success: false, message: 'Unauthorized! Access Token was expired!'});
        }
        if (err instanceof NotBeforeError) {
            return res.status(401).send({success: false, message: 'jwt not active'});
        }
        if (err instanceof JsonWebTokenError) {
            return res.status(401).send({success: false, message: 'jwt malformed'});
        }
        return
    })

    next()
    return

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
//     let foundUser = await userRepository.findUserByCode(req.body.code);
//
//     if (foundUser && foundUser.emailConfirmation.isConfirmed === false) {
//         next();
//         return;
//     }
//     return res.sendStatus(400);
// }

export const isEmailConfirmatedMiddlewareByCode = body('code').custom(async (value) => {
    let foundUser = await userRepository.findUserByCode(value);    //   console.log(`${blogsIdArray} exists blogID`)

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