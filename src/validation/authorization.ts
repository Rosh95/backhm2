import {NextFunction, Request, Response} from 'express';

const auth = require('basic-auth')
export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // const user = await auth(req);
    // const username: string = 'admin';
    // const password: string = 'qwerty';
    // if (user && user.name.toLowerCase() === username && user.pass.toLowerCase() === password) {
    //     next()
    // } else {
    //     res.status(401).end('Please, authorize.')
    // }

    const loginAndPassword = Buffer.from('admin:qwerty').toString('base64');
    let authorizationMethod = req.headers.authorization ? req.headers.authorization.split(' ')[0] : undefined;
    let authorizationPart = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
    if (authorizationMethod?.toLowerCase() !== 'Basic'.toLowerCase()) {
        authorizationPart = undefined;
    }

    if (authorizationPart === loginAndPassword) {
        next()
    } else {
        res.status(401).end('Please, authorize.')
    }


}