import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {userService} from '../domain/users-service';
import {commentQueryRepository} from "../repositories/comment/comment-query-repository";
import {userRepository} from "../repositories/user/user-repository";
import {body, param} from "express-validator";
import {blogsCollection} from "../db/dbMongo";
import {ObjectId} from "mongodb";


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

export const isEmailConfirmatedMiddleware = body('code').custom(async (value) => {
    let foundUser = await userRepository.findUserByCode(value);    //   console.log(`${blogsIdArray} exists blogID`)

    if (foundUser!.emailConfirmation.isConfirmed === true) {

        throw new Error('This email has confirmed.')
    }

    return true;

}).withMessage('This email has confirmed');