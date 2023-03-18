import {NextFunction, Request, Response} from 'express';

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const loginAndPassword = Buffer.from('admin:qwerty').toString('base64');
    let authorizationMethod = req.headers.authorization ? req.headers.authorization.split(' ')[0] : undefined;
    let authorizationPart = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    let isBasicauthorizationMethod = authorizationMethod?.toLowerCase() !== 'Basic'.toLowerCase();
    let isTrueLoginAndPassword = authorizationPart !== loginAndPassword;
    if (isBasicauthorizationMethod || isTrueLoginAndPassword) {
        res.sendStatus(401)
    } else {
        next()
    }


}