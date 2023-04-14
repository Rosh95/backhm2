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
    console.log(userId)
    console.log(typeof userId)
   const commentUserId = await commentsService.getCommentById(req.params.commentId);
    console.log(commentUserId);
    console.log(typeof commentUserId);



    if (userId) {
        // if (userId !== commentUserId){
        //     return res.sendStatus(403)
        // }
        req.user = await userService.findUserById(userId.toString())
        next();
        return
    }


    return res.sendStatus(401);


}