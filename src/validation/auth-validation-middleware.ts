import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {userService} from '../domain/users-service';
import {commentsService} from '../domain/comments-service';


export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token.toString());
    const commentUser = await commentsService.getCommentById(req.params.commentId);

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