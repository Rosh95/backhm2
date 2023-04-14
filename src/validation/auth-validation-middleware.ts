import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {userService} from '../domain/users-service';


// @ts-ignore
export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];

    const userId = await jwtService.getUserIdByToken(token.toString());
    if (!userId) {
        return res.sendStatus(401);

    }
    req.user = await userService.findUserById(userId.toString())
    next();

}